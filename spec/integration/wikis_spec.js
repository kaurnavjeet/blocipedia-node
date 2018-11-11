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
      }).then(user => {
        this.user = user;

        Wiki.create({
          title: "Wiki 1",
          body: "Wiki 1 is the first wiki",
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
      it("should return a status code 200 all wikis", done => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          expect(body).toContain("Wiki 1");
          done();
        });
      });
    });
    describe("GET /wikis/new", () => {
      it("should not render a new wiki form", done => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).not.toContain("New Wiki");
          expect(body).toContain("Wiki 1");
          done();
        });
      });
    });
    describe("POST /wikis/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "First Wiki",
          body: "My first wiki is here",
          private: false,
          userId: 0
        }
      };

      it("should not create a new wiki and redirect", done => {
        request.post(options, (err, res, body) => {
          Wiki.findOne({ where: { title: "First Wiki" } })
            .then(wiki => {
              expect(wiki).toBeNull();
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        });
      });
    });
    describe("GET /wikis/:id", () => {
      it("should render a view with the selected wiki", done => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Wiki 1");
          done();
        });
      });
    });
    describe("POST /wikis/:id/destroy", () => {
      it("should not delete the topic with the associated ID", done => {
        Wiki.all().then(wikis => {
          const wikiCountBeforeDelete = wikis.length;
          expect(wikiCountBeforeDelete).toBe(1);

          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.all().then(wikis => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCountBeforeDelete);
              done();
            });
          });
        });
      });
    });
    describe("GET /wikis/:id/edit", () => {
      it("should not render a view with an edit wiki form", done => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).not.toContain("Edit Wiki");
          expect(body).toContain("Wiki 1");
          done();
        });
      });
    });
    describe("POST /wikis/:id/update", () => {
      it("should not update the topic with the given value", done => {
        const options = {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "Wiki 2",
            body: "Wiki 2 is better than Wiki 1"
          }
        };

        request.post(options, (err, res, body) => {
          expect(err).toBeNull();
          Wiki.findOne({
            where: { id: this.wiki.id }
          }).then(wiki => {
            expect(wiki.title).toBe("Wiki 1");
            done();
          });
        });
      });
    });
  });

  describe("standard user attempting to perform CRUD actions on Wiki", () => {
    beforeEach(done => {
      User.create({
        username: "standard",
        email: "standard@example.com",
        password: "standarduser",
        role: 0
      }).then(user => {
        request.get(
          {
            url: "http://localhost:3000/auth/fake",
            form: {
              role: user.role,
              username: user.username,
              userId: user.id,
              email: user.email
            }
          },
          (err, res, body) => {
            done();
          }
        );
      });
    });
    describe("GET /wikis/new", () => {
      it("should render a form to create a new wiki", done => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });
      });
    });
    describe("POST /wikis/create", () => {
      it("should create a new post and redirect", done => {
        const options = {
          url: `${base}create`,
          form: {
            title: "Create Wiki",
            body: "Create your own Wiki",
            private: false,
            userId: this.user.id
          }
        };
        request.post(options, (err, res, body) => {
          Wiki.findOne({ where: { title: "Create Wiki" } })
            .then(wiki => {
              expect(wiki).not.toBeNull();
              expect(wiki.title).toBe("Create Wiki");
              expect(wiki.body).toBe("Create your own Wiki");
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        });
      });
      it("should not create a new post that fails validations", done => {
        const options = {
          url: `${base}create`,
          form: {
            title: "a",
            body: "b"
          }
        };
        request.post(options, (err, res, body) => {
          Wiki.findOne({ where: { title: "a" } })
            .then(wiki => {
              expect(wiki).toBeNull();
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        });
      });
    });
    describe("GET /wikis/:id", () => {
      it("should render a view with the selected wiki", done => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Wiki 1");
          done();
        });
      });
    });
    describe("POST /wikis/:id/destroy", () => {
      it("should delete the wiki with the associated id", done => {
        Wiki.all().then(wikis => {
          const wikiCountBeforeDelete = wikis.length;
          expect(wikiCountBeforeDelete).toBe(1);

          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.all().then(wikis => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
              done();
            });
          });
        });
      });
    });
    describe("GET /wikis/:id/edit", () => {
      it("should render a view with end edit wiki form", done => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Wiki");
          expect(body).toContain("Wiki 1");
          done();
        });
      });
    });
    describe("POST /wikis/:id/update", () => {
      it("should update the wiki with the given values", done => {
        const options = {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "Wiki 3",
            body: "Wiki 3 is better than Wiki 1"
          }
        };

        request.post(options, (err, res, body) => {
          expect(err).toBeNull();
          Wiki.findOne({ where: { id: this.wiki.id } }).then(wiki => {
            expect(wiki.title).toBe("Wiki 3");
            done();
          });
        });
      });
    });
  });
});
