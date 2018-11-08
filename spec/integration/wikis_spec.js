const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";

const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("routes : wikis", () => {
  beforeEach(done => {
    this.user;
    this.wiki;

    sequelize.sync({ force: true }).then(res => {
      User.create({
        username: "wikilover",
        email: "wikilover@example.com",
        password: "wikilover"
      })
        .then(user => {
          this.user = user;

          Wiki.create({
            title: "Wikipedia Lover",
            body: "I love to share information",
            private: false,
            userId: this.user.id
          })
            .then(wiki => {
              this.wiki = wiki;
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });
  describe("guest attempting to perform CRUD actions for Wiki", () => {
    beforeEach(done => {
      request.get(
        {
          url: "http://localhost:3000/auth/fake",
          form: {
            userId: 0
          }
        },
        (err, res, body) => {
          done();
        }
      );
    });

    describe("GET /wikis", () => {
      it("should return all wikis", done => {
        request.get(base, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          expect(body).toContain("Wikipedia Lover");
          done();
        });
      });
    });
  });
});
