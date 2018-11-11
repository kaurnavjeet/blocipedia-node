"use strict";

const faker = require("faker");

let wikis = [];

for (let i = 1; i <= 15; i++) {
  wikis.push({
    title: faker.hacker.noun(),
    body: faker.hacker.phrase(),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: faker.random.number({ min: 1, max: 15 })
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert("Wikis", wikis, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete("Wikis", null, {});
  }
};
