"use strict";

/*global afterEach, beforeEach, describe, it, sinon*/

const path = require("path");

describe("plugins/writer.js", function() {
    //system under test
    const sut = require("../../../lib/plugins/writer");

    const config = require("../../../lib/config");
    const fs = require("fs-extra");

    const sandbox = sinon.createSandbox();

    //stubs
    let createWriteStream;
    let ensureDir;
    let getConfig;
    let outputFile;

    beforeEach(function () {
        createWriteStream = sandbox.stub(fs, "createWriteStream");
        ensureDir = sandbox.stub(fs, "ensureDir");
        getConfig = sandbox.stub(config, "get");
        outputFile = sandbox.stub(fs, "outputFile");
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe("writeRootFile(name, data)", function () {
        it("should write data to path constructed from configured target directory and filename", function () {
            const data = "data";
            const filename = "index.html";
            const targetDirectory = "./target";

            getConfig.withArgs("targetDirectory").returns(targetDirectory);
            outputFile.returns(Promise.resolve());

            return sut.writeRootFile(filename, data).then(() => {
                outputFile.should.be.calledWith(path.join(targetDirectory, filename), data);
            });
        });
    });

    describe("createRootFileStream(name)", function () {
        it("should ensure that the directory of the output file exists", function () {
            const filename = "index.html";
            const targetDirectory = "./target";

            getConfig.withArgs("targetDirectory").returns(targetDirectory);
            ensureDir.returns(Promise.resolve());

            return sut.createRootFileStream(filename).then(() => {
                ensureDir.should.be.calledWith(path.dirname(path.join(targetDirectory, filename)));
            });
        });

        it("should ensure that the directory of the output file exists before creating the write stream", function () {
            const targetDirectory = "./target";

            getConfig.withArgs("targetDirectory").returns(targetDirectory);
            ensureDir.returns(Promise.resolve());

            return sut.createRootFileStream("").then(() => {
                sinon.assert.callOrder(ensureDir, createWriteStream);
            });
        });

        it("should create write stream to path constructed from configured target directory and filename", function () {
            const filename = "index.html";
            const targetDirectory = "./target";

            getConfig.withArgs("targetDirectory").returns(targetDirectory);
            ensureDir.returns(Promise.resolve());

            return sut.createRootFileStream(filename).then(() => {
                createWriteStream.should.be.calledWith(path.join(targetDirectory, filename));
            });
        });

        it("should return write stream", function () {
            const stream = "stream";

            getConfig.returns("");
            ensureDir.returns(Promise.resolve());
            createWriteStream.returns(Promise.resolve(stream));

            return sut.createRootFileStream("").then(result => {
                result.should.equal(stream);
            });
        });
    });

    describe("writeAlbumFile(album, name, data)", function () {
        it("should write data to path constructed from configured target directory, album ID and filename", function () {
            const album = { id: "album" };
            const data = "data";
            const filename = "index.html";
            const targetDirectory = "./target";

            getConfig.withArgs("targetDirectory").returns(targetDirectory);
            outputFile.returns(Promise.resolve());

            return sut.writeAlbumFile(album, filename, data).then(() => {
                outputFile.should.be.calledWith(path.join(targetDirectory, album.id, filename), data);
            });
        });
    });

    describe("createAlbumFileStream(album, name)", function () {
        it("should ensure that the directory of the output file exists", function () {
            const album = { id: "album" };
            const filename = "index.html";
            const targetDirectory = "./target";

            getConfig.withArgs("targetDirectory").returns(targetDirectory);
            ensureDir.returns(Promise.resolve());

            return sut.createAlbumFileStream(album, filename).then(() => {
                ensureDir.should.be.calledWith(path.dirname(path.join(targetDirectory, album.id, filename)));
            });
        });

        it("should ensure that the directory of the output file exists before creating the write stream", function () {
            const targetDirectory = "./target";

            getConfig.withArgs("targetDirectory").returns(targetDirectory);
            ensureDir.returns(Promise.resolve());

            sut.createAlbumFileStream({ id: "" }, "").then(() => {
                sinon.assert.callOrder(ensureDir, createWriteStream);
            });
        });

        it("should create output stream to path constructed from configured target directory, album ID and filename", function () {
            const album = { id: "album" };
            const filename = "index.html";
            const targetDirectory = "./target";

            getConfig.withArgs("targetDirectory").returns(targetDirectory);
            ensureDir.returns(Promise.resolve());

            return sut.createAlbumFileStream(album, filename).then(() => {
                createWriteStream.should.be.calledWith(path.join(targetDirectory, album.id, filename));
            });
        });

        it("should return write stream", function () {
            const stream = "stream";

            getConfig.returns("");
            ensureDir.returns(Promise.resolve());
            createWriteStream.returns(Promise.resolve(stream));

            sut.createAlbumFileStream({ id: "" }, "").then(result => {
                result.should.equal(stream);
            });
        });
    });

    describe("writeImageFile(album, image, name, data)", function () {
        it("should write data to path constructed from configured target directory, album ID, image ID and filename", function () {
            const album = { id: "album" };
            const data = "data";
            const filename = "index.html";
            const image = { id: "image" };
            const targetDirectory = "./target";

            getConfig.withArgs("targetDirectory").returns(targetDirectory);
            outputFile.returns(Promise.resolve());

            return sut.writeImageFile(album, image, filename, data).then(() => {
                outputFile.should.be.calledWith(path.join(targetDirectory, album.id, image.id, filename), data);
            });
        });
    });

    describe("createImageFileStream(album, image, name)", function () {
        it("should ensure that the directory of the output file exists", function () {
            const album = { id: "album" };
            const filename = "index.html";
            const image = { id: "image" };
            const targetDirectory = "./target";

            getConfig.withArgs("targetDirectory").returns(targetDirectory);
            ensureDir.returns(Promise.resolve());

            return sut.createImageFileStream(album, image, filename).then(() => {
                ensureDir.should.be.calledWith(path.dirname(path.join(targetDirectory, album.id, image.id, filename)));
            });
        });

        it("should ensure that the directory of the output file exists before creating the write stream", function () {
            const targetDirectory = "./target";

            getConfig.withArgs("targetDirectory").returns(targetDirectory);
            ensureDir.returns(Promise.resolve());

            sut.createImageFileStream({ id: "" }, { id: "" }, "").then(() => {
                sinon.assert.callOrder(ensureDir, createWriteStream);
            });
        });


        it("should create output stream to path constructed from configured target directory, album ID, image ID and filename", function () {
            const album = { id: "album" };
            const filename = "index.html";
            const image = { id: "image" };
            const targetDirectory = "./target";

            getConfig.withArgs("targetDirectory").returns(targetDirectory);
            ensureDir.returns(Promise.resolve());

            return sut.createImageFileStream(album, image, filename).then(() => {
                createWriteStream.should.be.calledWith(path.join(targetDirectory, album.id, image.id, filename));
            });
        });

        it("should return write stream", function () {
            const stream = "stream";

            getConfig.returns("");
            ensureDir.returns(Promise.resolve());
            createWriteStream.returns(stream);

            sut.createImageFileStream({ id: "" }, { id: "" }, "").then(result => {
                result.should.equal(stream);
            });
        });
    });
});
