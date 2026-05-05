Feature: Login

  @smoke
  Scenario: Login using env credentials with reusable POM
    Given I am on the login page
    When I login using env credentials
    #Then I should see the products page
