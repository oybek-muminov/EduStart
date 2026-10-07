"""Verify the buyer ZIP with ordinary Python extraction and, when present, unzip."""

import argparse
import hashlib
import json
import shutil
import subprocess
import tempfile
import zipfile
from pathlib import Path, PurePosixPath


def digest(data):
    return hashlib.sha256(data).hexdigest()


def check_tree(destination, prefix, manifest, root, qa):
    package = destination / prefix
    assert (package / "site").is_dir(), "site/ was not extracted as a directory"
    assert (package / "docs").is_dir(), "docs/ was not extracted as a directory"
    expected = {item["file"] for item in manifest["files"]} | {"MANIFEST.json"}
    actual = {p.relative_to(package).as_posix() for p in package.rglob("*") if p.is_file()}
    assert actual == expected, "Extracted file list differs from the manifest"
    for item in manifest["files"]:
        data = (package / item["file"]).read_bytes()
        assert len(data) == item["bytes"], item["file"]
        assert digest(data) == item["sha256"], item["file"]
        assert data == (root / item["file"]).read_bytes(), item["file"]
    sources = {}
    for name, expected_hash in qa["assets"].items():
        source = package / "site" / name
        assert source.is_file(), name
        assert digest(source.read_bytes()) == expected_hash, f"Original QA/source mismatch: {name}"
        sources[name] = expected_hash
    assert len(sources) == 7
    for shot in qa["screenshots"]:
        assert digest((package / shot["file"]).read_bytes()) == shot["sha256"], shot["file"]
    assert len(qa["screenshots"]) == 21
    guide = (package / "START-HERE.md").read_text(encoding="utf-8")
    for unwanted in ("Oybek", "Codex", "Notion", "Gumroad", "mustaqil", "reviewer"):
        assert unwanted.lower() not in guide.lower(), f"Internal workflow in buyer guide: {unwanted}"
    for html in ("index.html", "ru.html", "en.html"):
        assert (package / "site" / html).is_file()
    return sources


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--package-version", default="1.0.1")
    args = parser.parse_args()
    assert args.package_version in ("1.0.1",), "Only the corrected package is supported"
    root = Path(__file__).resolve().parent.parent
    version = args.package_version
    filename = f"release/EduStart_UZ_RU_EN_v{version}.zip"
    archive = root / filename
    prefix = f"EduStart_UZ_RU_EN_v{version}"
    qa = json.loads((root / "docs/QA-v1.0.0.json").read_text(encoding="utf-8"))
    assert qa["status"] == "passed" and len(qa["matrix"]) == 15
    methods = []
    with zipfile.ZipFile(archive) as package:
        names = package.namelist()
        assert len(names) == len(set(names)), "Duplicate raw archive names"
        for name in names:
            assert "\\" not in name, f"Backslash in raw ZIP entry: {name}"
            p = PurePosixPath(name)
            assert not p.is_absolute() and ".." not in p.parts and p.parts[0] == prefix, name
        assert package.testzip() is None, "ZIP CRC failure"
        manifest = json.loads(package.read(f"{prefix}/MANIFEST.json"))
        assert manifest["version"] == version
        assert set(names) == {f"{prefix}/{f['file']}" for f in manifest["files"]} | {f"{prefix}/MANIFEST.json"}
        with tempfile.TemporaryDirectory(prefix="edustart-python-extract-") as target:
            # Standard extraction: do not rewrite or normalize any ZIP entry name.
            package.extractall(target)
            sources = check_tree(Path(target), prefix, manifest, root, qa)
            methods.append({"method": "python zipfile.ZipFile.extractall", "status": "PASS", "files": len(names)})
    unzip = shutil.which("unzip")
    if unzip:
        with tempfile.TemporaryDirectory(prefix="edustart-unzip-extract-") as target:
            completed = subprocess.run([unzip, "-q", str(archive), "-d", target], capture_output=True, text=True, check=False)
            assert completed.returncode == 0, completed.stderr
            check_tree(Path(target), prefix, manifest, root, qa)
            methods.append({"method": "unzip -q ZIP -d TEMP", "status": "PASS", "files": len(names)})
    else:
        methods.append({"method": "unzip", "status": "not_available"})
    with zipfile.ZipFile(root / "release/EduStart_UZ_RU_EN_v1.0.0.zip") as previous:
        old_names = previous.namelist()
        old_backslashes = sum("\\" in name for name in old_names)
        old_files = {name.replace("\\", "/").split("/", 1)[1]: previous.read(name) for name in old_names}
        assert all(digest(old_files["site/" + name]) == sha for name, sha in sources.items())
        assert all(digest(old_files[shot["file"]]) == shot["sha256"] for shot in qa["screenshots"])
        assert old_files["docs/LICENSE.txt"] == (root / "docs/LICENSE.txt").read_bytes()
        assert old_files["seller/cover.png"] == (root / "seller/cover.png").read_bytes()
    proof = {
        "filename": filename,
        "version": version,
        "source_version": "1.0.0",
        "qa_version": "1.0.0",
        "bytes": archive.stat().st_size,
        "sha256": digest(archive.read_bytes()),
        "files": len(names),
        "raw_backslash_entries": 0,
        "crc": "PASS",
        "standard_extraction": methods,
        "site_and_docs_directories": "PASS",
        "extracted_manifest_hashes_and_source_bytes": "PASS",
        "unchanged_site_sources": sources,
        "unchanged_qa_screenshots": 21,
        "unchanged_license_and_cover": True,
        "buyer_start_here": "PASS",
        "previous_zip_backslash_entries": old_backslashes,
        "browser_qa_rerun": False,
        "review_state": "awaiting-independent-review",
        "published": False,
    }
    output = root / f"release/EXTRACTION-VERIFIED-v{version}.json"
    output.write_text(json.dumps(proof, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(proof, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
