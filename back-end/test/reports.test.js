// Abdullah's tests for GET /api/reports and POST /api/reports go here.
// Look at app.test.js for an example of how to write one.

import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import fs from "fs";
import os from "node:os";
import path from "node:path";

describe("report routes", function () {
  const originalDirectory = process.cwd();
  let testDirectory;

  beforeEach(function () {
    testDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "curbcut-reports-"));
    fs.cpSync(
      path.join(originalDirectory, "data"),
      path.join(testDirectory, "data"),
      {
        recursive: true,
      },
    );
    process.chdir(testDirectory);
  });

  afterEach(function () {
    process.chdir(originalDirectory);
    fs.rmSync(testDirectory, { recursive: true, force: true });
  });

  describe("GET /api/reports", function () {
    it("returns the seeded report with its original fields", async function () {
      const response = await request(app).get("/api/reports");

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");

      const report = response.body.find(function (report) {
        return report.id === "mock-report-1";
      });

      expect(report).to.deep.equal({
        id: "mock-report-1",
        buildingId: "kimmel-center",
        entranceId: "kimmel-main",
        floorId: null,
        category: "Blocked ramp",
        description:
          "The main entrance ramp is blocked by several large boxes.",
        observedAt: "2026-11-01T15:00:00.000Z",
        createdAt: "2026-11-01T15:05:00.000Z",
        updatedAt: "2026-11-01T15:05:00.000Z",
        photo: null,
        status: "Active",
      });
    });
    it("returns an empty list when no reports exist", async function () {
      const originalText = fs.readFileSync("data/reports.json", "utf-8");

      try {
        fs.writeFileSync("data/reports.json", "[]");

        const response = await request(app).get("/api/reports");

        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal([]);
      } finally {
        fs.writeFileSync("data/reports.json", originalText);
      }
    });
  });

  describe("POST /api/reports", function () {
    it("rejects a report with a numeric description and leaves stored reports unchanged", async function () {
      const before = fs.readFileSync("data/reports.json", "utf-8");

      const report = {
        buildingId: "kimmel-center",
        entranceId: "kimmel-main",
        floorId: null,
        category: "Blocked ramp",
        observedAt: "2026-11-01T15:00:00.000Z",
        description: 123,
      };

      const response = await request(app).post("/api/reports").send(report);
      const after = fs.readFileSync("data/reports.json", "utf-8");

      expect(response.status).to.equal(400);
      expect(response.body.errors.description).to.equal(
        "Describe the barrier in at least 10 words.",
      );
      expect(after).to.equal(before);
    });
    it("rejects a report with a missing observation time", async function () {
      const report = {
        buildingId: "kimmel-center",
        entranceId: "kimmel-main",
        floorId: null,
        category: "Blocked ramp",
        description:
          "The main entrance ramp is blocked by several large boxes.",
      };

      const response = await request(app).post("/api/reports").send(report);

      expect(response.status).to.equal(400);
      expect(response.body.errors.observedAt).to.equal(
        "Choose a valid observation date and time.",
      );
    });

    it("creates a valid report and returns it in GET /api/reports", async function () {
      const originalText = fs.readFileSync("data/reports.json", "utf-8");

      const report = {
        buildingId: "kimmel-center",
        entranceId: "kimmel-main",
        floorId: null,
        category: "Blocked ramp",
        observedAt: "2026-11-01T15:00:00.000Z",
        description:
          "Several heavy delivery boxes are blocking wheelchair access to the main entrance.",
      };

      try {
        const created = await request(app).post("/api/reports").send(report);

        expect(created.status).to.equal(201);
        expect(created.body.id).to.be.a("string").and.not.be.empty;

        const list = await request(app).get("/api/reports");

        expect(list.status).to.equal(200);
        expect(list.body).to.be.an("array");

        const savedReport = list.body.find(function (item) {
          return item.id === created.body.id;
        });

        expect(savedReport).to.be.an("object");
        expect(savedReport.description).to.equal(report.description.trim());
      } finally {
        fs.writeFileSync("data/reports.json", originalText);
      }
    });

    it("rejects a valid floor with an invalid entrance and leaves stored reports unchanged", async function () {
      const before = fs.readFileSync("data/reports.json", "utf-8");

      const report = {
        buildingId: "kimmel-center",
        entranceId: "does-not-exist",
        floorId: "kimmel-floor-1",
        category: "Elevator outage",
        observedAt: "2026-11-01T15:00:00.000Z",
        description:
          "The elevator on the first floor is out of service and blocking wheelchair access.",
      };

      try {
        const response = await request(app).post("/api/reports").send(report);
        const after = fs.readFileSync("data/reports.json", "utf-8");

        expect(response.status).to.equal(400);
        expect(response.body.errors.location).to.equal(
          "Choose a valid entrance or floor for the selected building.",
        );
        expect(after).to.equal(before);
      } finally {
        fs.writeFileSync("data/reports.json", before);
      }
    });
  });

  it("rejects a text file uploaded as a PNG", async function () {
    const response = await request(app)
      .post("/api/reports")
      .field("buildingId", "kimmel-center")
      .field("entranceId", "kimmel-main")
      .field("category", "Blocked ramp")
      .field(
        "description",
        "The main entrance ramp is blocked by several large boxes.",
      )
      .field("observedAt", "2026-11-01T15:00:00.000Z")
      .attach("photo", Buffer.from("plain text"), {
        filename: "photo.png",
        contentType: "image/png",
      });

    expect(response.status).to.equal(400);
    expect(response.body.errors.photo).to.equal(
      "Choose a valid JPEG or PNG photo.",
    );
  });

  it("rejects a photo larger than 5 MB", async function () {
    const response = await request(app)
      .post("/api/reports")
      .attach("photo", Buffer.alloc(5_000_001), {
        filename: "large.png",
        contentType: "image/png",
      });

    expect(response.status).to.equal(400);
    expect(response.body.errors.photo).to.equal(
      "Choose a photo no larger than 5 MB.",
    );
  });
  it("saves a valid PNG with the report", async function () {
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aXZkAAAAASUVORK5CYII=",
      "base64",
    );

    const created = await request(app)
      .post("/api/reports")
      .field("buildingId", "kimmel-center")
      .field("entranceId", "kimmel-main")
      .field("category", "Blocked ramp")
      .field(
        "description",
        "The main entrance ramp is blocked by several large boxes.",
      )
      .field("observedAt", "2026-11-01T15:00:00.000Z")
      .attach("photo", png, { filename: "ramp.png", contentType: "image/png" });

    expect(created.status).to.equal(201);
    expect(created.body.photo).to.exist;

    const list = await request(app).get("/api/reports");
    const saved = list.body.find((report) => report.id === created.body.id);
    expect(saved.photo).to.deep.equal(created.body.photo);
  });
  it("leaves no report or photo when the report is invalid", async function () {
    const photoDir = "data/report-photos";
    const listPhotos = () =>
      fs.existsSync(photoDir) ? fs.readdirSync(photoDir).sort() : [];

    const reportsBefore = fs.readFileSync("data/reports.json", "utf8");
    const photosBefore = listPhotos();
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aXZkAAAAASUVORK5CYII=",
      "base64",
    );

    const response = await request(app)
      .post("/api/reports")
      .field("buildingId", "kimmel-center")
      .field("entranceId", "kimmel-main")
      .field("category", "Blocked ramp")
      .field("description", "Too short")
      .field("observedAt", "2026-11-01T15:00:00.000Z")
      .attach("photo", png, { filename: "ramp.png", contentType: "image/png" });

    expect(response.status).to.equal(400);
    expect(response.body.errors).to.have.property("description");
    expect(response.body.errors).to.not.have.property("photo");
    expect(fs.readFileSync("data/reports.json", "utf8")).to.equal(
      reportsBefore,
    );
    expect(listPhotos()).to.deep.equal(photosBefore);
  });
});
