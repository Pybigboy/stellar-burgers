/// <reference types="cypress" />

import user from './user.json';
import orderSuccess from './order-success.json';
import ingredients from './ingredients.json';

const SELECTORS = {
  bunAddButton: '.add-button-bun',
  mainAddButton: '.add-button-main',
  orderButton: '[data-test="order-button"]',
  orderModal: '[data-test="order-modal"]',
  orderNumber: '[data-test="order-number"]',
  modalCloseButton: '[data-test="modal-close-button"]',
  constructorElement: '.constructor-element'
};

describe('Конструктор: оформление заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { body: ingredients }).as('getIngredients');

    cy.intercept('GET', '**/auth/user', {
      statusCode: 200,
      body: { success: true, user: user.user }
    }).as('getUser');

    cy.intercept('POST', '**/orders', {
      statusCode: 200,
      body: orderSuccess
    }).as('createOrder');

    cy.then(() => {
      window.localStorage.setItem('refreshToken', 'fake-refresh-token');
      cy.setCookie('accessToken', 'Bearer fake-access-token');
    });

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('успешно оформляет заказ и очищает конструктор', () => {
    cy.get(SELECTORS.bunAddButton).first().click({ force: true });
    cy.get(SELECTORS.mainAddButton).first().click({ force: true });

    cy.get(SELECTORS.orderButton).click({ force: true });

    cy.get('#modals').find(SELECTORS.orderModal).should('exist');
    cy.get(SELECTORS.orderNumber).should('contain', orderSuccess.order.number);

    cy.get(SELECTORS.modalCloseButton).click();
    cy.get('#modals').find(SELECTORS.orderModal).should('not.exist');

    cy.get(SELECTORS.constructorElement).should('not.exist');
  });
});
