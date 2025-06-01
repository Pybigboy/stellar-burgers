/// <reference types="cypress" />

import ingredients from './ingredients.json';

const SELECTORS = {
  ingredientLink: '[data-test="ingredient-link"]',
  ingredientModal: '[data-test="ingredient-modal"]',
  modalCloseButton: '[data-test="modal-close-button"]',
  modalOverlay: '[data-test="modal-overlay"]'
};

describe('Конструктор: модальное окно ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { body: ingredients }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  const openModal = () => {
    cy.get(SELECTORS.ingredientLink).first().click();
    cy.get('#modals').find(SELECTORS.ingredientModal).should('exist');
  };

  it('открывается по клику на ингредиент', () => {
    openModal();
  });

  it('закрывается по кнопке закрытия', () => {
    openModal();
    cy.get(SELECTORS.modalCloseButton).click();
    cy.get('#modals').find(SELECTORS.ingredientModal).should('not.exist');
  });

  it('закрывается по клавише Escape', () => {
    openModal();
    cy.get('body').type('{esc}');
    cy.get('#modals').find(SELECTORS.ingredientModal).should('not.exist');
  });

  it('закрывается по клику на оверлей', () => {
    openModal();
    cy.get(SELECTORS.modalOverlay).click({ force: true });
    cy.get('#modals').find(SELECTORS.ingredientModal).should('not.exist');
  });
});
