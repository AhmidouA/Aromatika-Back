// librairie SuperTest
const request = require("supertest");
const server = require("../server");

const {User } = require("../models");
const bcrypt = require("bcrypt");

// test data
const testUser = {
  username: "testUser",
  mail: "testUser@test.com",
  password: "testPassword",
  role_id: 1,
};

describe("User endpoints", () => {
  
});