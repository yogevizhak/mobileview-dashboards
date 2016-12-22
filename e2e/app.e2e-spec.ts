import { MobileviewPage } from './app.po';

describe('mobileview App', function() {
  let page: MobileviewPage;

  beforeEach(() => {
    page = new MobileviewPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
