const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {
  beforeEach(done => {
    this.user;
    sequelize
      .sync({ force: true })
      .then(() => {
        done();
      })
      .catch(err => {
        console.log(err);
        done();
      });
  });
  describe("#create()", () => {
    it("should create a User object with a valid username, email, and password", done => {
      User.create({
        username: "username",
        email: "user@example.com",
        password: "userpassword"
      })
        .then(user => {
          expect(user.username).toBe("username");
          expect(user.email).toBe("user@example.com");
          expect(user.id).toBe(1);
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
    it("should not create a user with invalid username, email or password", done => {
      User.create({
        username: "user",
        email: "no",
        password: "nouser"
      })
        .then(user => {
          done();
        })
        .catch(err => {
          expect(err.message).toContain(
            "Validation error: must be a valid email"
          );
          done();
        });
    });
    it("should not create a user with a username or email already taken", done => {
      User.create({
        username: "username",
        email: "user@example.com",
        password: "userexample"
      })
        .then(user => {
          User.create({
            username: "username",
            email: "user@example.com",
            password: "cannotbesame"
          })
            .then(user => {
              done();
            })
            .catch(err => {
              expect(err.message).toContain("Validation error");
              done();
            });
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });
});
