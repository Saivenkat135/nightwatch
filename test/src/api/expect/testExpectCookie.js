const assert = require('assert');
const Nocks = require('../../../lib/nocks.js');
const ExpectGlobals = require('../../../lib/globals/expect.js');

describe('expect.cookie', function() {
  beforeEach(function(done) {
    ExpectGlobals.beforeEach.call(this, () => {
      this.client.api.globals.abortOnAssertionFailure = false;
      done();
    });
  });

  afterEach(function(done) {
    Nocks.cleanAll();
    ExpectGlobals.afterEach.call(this, done);
  });

  it('to contain [PASSED]', function() {
    Nocks.cookie('cookie-name', 'cookie-value');
    let expect = this.client.api.expect.cookie('cookie-name').to.contain('cookie-value');

    return this.client.start(function() {
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected cookie to contain: "cookie-value"'));
    });
  });

  it('contains [PASSED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.cookie('cookie-name', 'cookie-value');

    let expect = this.client.api.expect.cookie('cookie-name').contains('cookie-value');

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected cookie to contain: "cookie-value"'));
    });
  });

  it('to equal to [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.cookie('cookie-name', 'cookie-value');

    let expect = this.client.api.expect.cookie('cookie-name').to.equal('other-cookie-value');

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.resultValue, 'cookie-value');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' equal: "other-cookie-value"');
      assert.ok(expect.assertion.message.startsWith('Expected cookie to equal: "other-cookie-value"'));
    });
  });

  it('to NOT equal to [PASSED]', function() {
    Nocks.cookie('cookie-name', 'cookie-value');

    let expect = this.client.api.expect.cookie('cookie-name').to.not.equal('xx');

    return this.client.start(function() {
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.resultValue, 'cookie-value');
      assert.equal(expect.assertion.messageParts[0], ' not equal: "xx"');
      assert.ok(expect.assertion.message.startsWith('Expected cookie to not equal: "xx"'));
    });
  });

  it('to NOT equal to [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.cookie('cookie-name', 'cookie-value');

    let expect = this.client.api.expect.cookie('cookie-name').to.not.equal('cookie-value');

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.resultValue, 'cookie-value');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' not equal: "cookie-value"' );
      assert.ok(expect.assertion.message.startsWith('Expected cookie to not equal: "cookie-value"'));
    });
  });

  it('to equal waitFor [PASSED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.cookie('cookie-name', 'other');
    Nocks.cookie('cookie-name', 'cookie-value');

    let expect = this.client.api.expect.cookie('cookie-name').to.equal('cookie-value').before(110);
    Nocks.cookie('cookie-name', 'cookie-value');

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 110);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.retries, 1);
      assert.ok(expect.assertion.message.startsWith('Expected cookie to equal: "cookie-value" in 110ms - condition was met in ' + expect.assertion.elapsedTime + 'ms'));
    });
  });

  it('to equal and waitFor [FAILED] - value not equal', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.cookie('cookie-name', 'other');

    let expect = this.client.api.expect.cookie('cookie-name').to.equal('cookie-value').before(110);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 110);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.retries >= 1);
      assert.ok(expect.assertion.elapsedTime >= 110);
      assert.equal(expect.assertion.expected, 'present');
      //assert.equal(expect.assertion.actual, 'xx');
      assert.ok(expect.assertion.message.startsWith('Expected cookie to equal: "cookie-value" in 110ms'));
    });
  });


  it('to not contains [PASSED]', function() {
    Nocks.cookie('cookie-name', 'other');

    let expect = this.client.api.expect.cookie('cookie-name').to.not.contains('vasq');

    assert.ok(expect.assertion.message.startsWith('Expected cookie to'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not contain \'vasq\'');
      assert.equal(expect.assertion.actual, 'other');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'other');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' not contain: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected cookie to not contain: "vasq"'));
    });
  });


  it('with domain to contain [PASSED]', function() {
    Nocks.cookie('cookie-name', 'cookie-value');
    let expect = this.client.api.expect.cookie('cookie-name', 'cookie-domain').to.contain('cookie-value');

    return this.client.start(function() {
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected cookie to contain: "cookie-value"'));
    });
  });

  it('with domain to contain [FAILED]', function() {
    Nocks.cookie('cookie-name', 'cookie-value');
    let expect = this.client.api.expect.cookie('cookie-name', 'cookie-domain').to.contain('other-cookie-value');

    return this.client.start(function() {
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected cookie to contain: "cookie-value"'));
    });
  });

  it('with domain to NOT contain [PASSED]', function() {
    Nocks.cookie('cookie-name', 'cookie-value');
    let expect = this.client.api.expect.cookie('cookie-name', 'cookie-domain').not.to.contain('other-cookie-value');

    return this.client.start(function() {
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected cookie to not contain: "other-cookie-value"'), expect.assertion.message);
    });
  });

  it('with domain to NOT contain [FAILED]', function() {
    Nocks.cookie('cookie-name', 'cookie-value');
    let expect = this.client.api.expect.cookie('cookie-name', 'cookie-domain').not.to.contain('cookie-value');

    return this.client.start(function() {
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected cookie to not contain: "cookie-value"'), expect.assertion.message);
    });
  });


  it('to not contain [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.cookie('cookie-name', 'other');

    let expect = this.client.api.expect.cookie('cookie-name').to.not.contains('other');
    assert.ok(expect.assertion.message.startsWith('Expected cookie to'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'other');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts[0], ' not contain: "other"');
      assert.ok(expect.assertion.message.startsWith('Expected cookie to not contain: "other"'));
    });
  });

  it('to not match [PASSED]', function() {
    Nocks.cookie('cookie-name', 'other');

    let expect = this.client.api.expect.cookie('cookie-name').to.not.match(/vasq/);

    assert.ok(expect.assertion.message.startsWith('Expected cookie to'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not match \'/vasq/\'');
      assert.equal(expect.assertion.actual, 'other');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'other');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' not match: "/vasq/"');
      assert.ok(expect.assertion.message.startsWith('Expected cookie to not match: "/vasq/"'));
    });
  });

  it('to not match [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.cookie('cookie-name', 'other');

    let expect = this.client.api.expect.cookie('cookie-name').to.not.match(/other/);
    assert.ok(expect.assertion.message.startsWith('Expected cookie to'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'other');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts[0], ' not match: "/other/"');
      assert.ok(expect.assertion.message.startsWith('Expected cookie to not match: "/other/"'));
    });
  });

  it('to equal to - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.cookie('', 'other');
    let expect = this.client.api.expect.cookie('cookie-name').to.equal('vasq');
    assert.ok(expect.assertion.message.startsWith('Expected cookie to'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.resultValue, null);
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [' equal: "vasq"', ' - element was not found']);
      assert.ok(expect.assertion.message.startsWith('Expected cookie to equal: "vasq" - element was not found'));
    });
  });

  it('to  which contains - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.cookie('', 'other');

    let expect = this.client.api.expect.cookie('cookie-name').to.which.contains('vasq');

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [' which ', 'contains: "vasq"', ' - element was not found']);
      assert.ok(expect.assertion.message.startsWith('Expected cookie to which contains: "vasq" - element was not found'));
    });
  });

  it('to  match - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.cookie('', 'other');

    let expect = this.client.api.expect.cookie('cookie-name').to.which.matches(/vasq$/);

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [' which ', 'matches: "/vasq$/"', ' - element was not found' ]);
      assert.ok(expect.assertion.message.startsWith('Expected cookie to which matches: "/vasq$/" - element was not found'));
    });
  });

  it('to  equal to with waitFor - element not found', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.cookie('', 'other');

    let expect = this.client.api.expect.cookie('cookie-name').to.equal('hp vasq').before(60);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected cookie to equal: "hp vasq" in 60ms - element was not found'));
    });
  });

  it('to equal with waitFor - element found on retry', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.cookie('', 'other');
    Nocks.cookie('cookie-name', 'hp vasq');

    let expect = this.client.api.expect.cookie('cookie-name').to.equal('hp vasq').before(110);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 110);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected cookie to equal: "hp vasq" in 110ms - condition was met in ' + expect.assertion.elapsedTime + 'ms'));
    });
  });

  it('to  match - throws exception on invalid regex', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.cookie('cookie-name', 'other');

    let expect = this.client.api.expect.cookie('cookie-name');
    assert.throws(function() {
      expect.matches('');
    }.bind(this));

    return this.client.start();
  });

  it('to equal and waitFor [FAILED] - value not found', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.cookie('cookie-name', 'other');

    let expect = this.client.api.expect.cookie('cookie-name').to.equal('hp vasq').before(110);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 110);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.retries > 1);
      assert.ok(expect.assertion.message.startsWith('Expected cookie to equal: "hp vasq" in 110ms'));
    });
  });
});
