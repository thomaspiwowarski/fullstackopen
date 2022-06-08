describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "Tomasz Piwowarski",
      username: "pomasz",
      password: "mockpassword",
    };
    cy.request("POST", "http://localhost:3003/api/users", user);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("log in to application");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.login({ username: "pomasz", password: "mockpassword" });
      cy.contains("Tomasz Piwowarski logged in");
    });

    it("fails with wrong credentials", function () {
      cy.contains("login").click();

      cy.get(".error")
        .should("contain", "Wrong credentials")
        .and("have.css", "color", "rgb(255, 0, 0)")
        .and("have.css", "border-style", "solid");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "pomasz", password: "mockpassword" });
      cy.contains("Tomasz Piwowarski logged in");
    });

    it("A blog can be created", function () {
      cy.contains("new blog").click();
      cy.get("#author").type("cypress author");
      cy.get("#title").type("cypress title");
      cy.get("#url").type("cypress url");
      cy.contains("add blog").click();
      cy.contains("cypress author");
      cy.contains("cypress title");
    });

    describe("and several blogs exist", function () {
      beforeEach(function () {
        cy.addBlog({
          author: "first author",
          title: "first title",
          url: "http://first.url",
        });
        cy.addBlog({
          author: "second author",
          title: "second title",
          url: "http://second.url",
        });
        cy.addBlog({
          author: "third author",
          title: "third title",
          url: "http://third.url",
        });
      });

      it("one of those can be made liked", function () {
        cy.contains("second author").contains("view").click();
        cy.contains("second author").contains("like").click();

        cy.contains("second author").contains("likes 1");
      });

      it("the user who created a blog can delete it", function () {
        cy.contains("second author").contains("view").click();
        cy.contains("second author").contains("remove").click();
        cy.contains("second author").should("not.exist");
      });

      it("the user who doesn't created a blog can't delete it", function () {
        cy.contains("logout").click();
        const user = {
          name: "Can't delete",
          username: "cant",
          password: "mockpassword",
        };
        cy.request("POST", "http://localhost:3003/api/users", user);

        cy.login({ username: user.username, password: user.password });
        cy.contains("second author").contains("view").click();
        cy.contains("remove").should("not.exist");
      });

      it("checks that the blogs are ordered according to likes with the blog with the most likes being first", function () {
        cy.addBlog({
          author: "example author1",
          title: "example title1",
          url: "http://example1.url",
          likes: 50,
        });
        cy.addBlog({
          author: "example author2",
          title: "example title2",
          url: "http://example2.url",
          likes: 40,
        });
        cy.addBlog({
          author: "example author3",
          title: "example title3",
          url: "http://example3.url",
          likes: 12,
        });

        cy.get(".blog").each((blog) => {
          cy.wrap(blog).contains("view").click();
        });

        cy.get(".blog").eq(0).should("contain", "example author1");
        cy.get(".blog").eq(1).should("contain", "example author2");
        cy.get(".blog").eq(2).should("contain", "example author3");
      });
    });
  });
});
