/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("usuarios").del();
  await knex("usuarios").insert([
    {
      id: 1,
      nome: "Administrador do Sistema",
      login: "admin",
      senha: "$2a$10$mdQBYCE7ERswaD4qB3cPWuXsSMwA9g/5wx0aHVGuXMyGwkEl.VS4m", //1234
      email: "admin@pucminas.br",
      roles: "ADMIN;USER",
    },
    {
      id: 2,
      nome: "Usuario",
      login: "user",
      senha: "$2a$10$mdQBYCE7ERswaD4qB3cPWuXsSMwA9g/5wx0aHVGuXMyGwkEl.VS4m", // 1234
      email: "user@pucminas.br",
      roles: "USER",
    },
  ]);
};
