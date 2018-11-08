const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {
  beforeEach(done => {
    this.user;
    this.wiki;

    sequelize.sync({ force: true }).then(res => {
      User.create({
        username: "wikipedia",
        email: "wikipedia@example.com",
        password: "wikipedia"
      })
        .then(user => {
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
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });
  describe("#create()", () => {
    it("should create a new wiki with a title, body, private value, and assigned user", done => {
      Wiki.create({
        title: "First Wiki",
        body: "This is my first wiki",
        private: false,
        userId: this.user.id
      })
        .then(wiki => {
          expect(wiki.title).toBe("First Wiki");
          expect(wiki.body).toBe("This is my first wiki");
          expect(wiki.userId).toBe(this.user.id);
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
    it("should not create a wiki with a missing title, body, private value, or assigned user", done => {
      Wiki.create({
        title: "Invalid Wiki"
      })
        .then(wiki => {
          done();
        })
        .catch(err => {
          expect(err.message).toContain("Wiki.body cannot be null");
          expect(err.message).toContain("Wiki.userId cannot be null");
          expect(err.message).toContain("Wiki.private cannot be null");
          done();
        });
    });
  });
  describe("#setUser()", () => {
    it("should associate a user and a wiki together", done => {
      User.create({
        username: "wikiowner",
        email: "wiki@example.com",
        password: "wikiowner"
      }).then(newUser => {
        expect(this.wiki.userId).toBe(this.user.id);

        this.wiki.setUser(newUser).then(wiki => {
          expect(wiki.userId).toBe(newUser.id);
          done();
        });
      });
    });
  });
  describe("#getUser()", () => {
    it("should return the associated user", done => {
      this.wiki.getUser().then(associatedUser => {
        expect(associatedUser.username).toBe("wikipedia");
        done();
      });
    });
  });
});
