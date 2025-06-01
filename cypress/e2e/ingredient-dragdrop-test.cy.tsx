/// <reference types="cypress" />

import ingredients from './ingredients.json';

const SELECTORS = {
  bunAddButton: '.add-button-bun',
  mainAddButton: '.add-button-main',
  constructorTop: '.constructor-element_pos_top',
  constructorBottom: '.constructor-element_pos_bottom',
  constructorMain: '.constructor-element__row'
};

describe('Конструктор: добавление ингредиентов', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { body: ingredients }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('добавляет булку в конструктор', () => {
    const bun = ingredients.data.find((item) => item.type === 'bun');
    if (!bun) throw new Error('Булка не найдена в моках');

    cy.get(SELECTORS.bunAddButton).first().click({ force: true });

    cy.get(SELECTORS.constructorTop).should('contain', bun.name);
    cy.get(SELECTORS.constructorBottom).should('contain', bun.name);
  });

  it('добавляет начинку в конструктор', () => {
    const main = ingredients.data.find((item) => item.type === 'main');
    if (!main) throw new Error('Начинка не найдена в моках');

    cy.get(SELECTORS.mainAddButton).first().click({ force: true });

    cy.get(SELECTORS.constructorMain).should('contain', main.name);
  });
});
