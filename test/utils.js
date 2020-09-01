const errTypes = {
  revert: "revert",
  outOfGas: "out of gas",
  invalidJump: "invalid JUMP",
  invalidOpcode: "invalid opcode",
  stackOverflow: "stack overflow",
  stackUnderflow: "stack underflow",
  staticStateChange: "static state change"
};
const PREFIX = "Returned error: VM Exception while processing transaction: ";

const assertRevert = async function(promise, errType) {
  try {
    await promise;
    throw new Error('tx not revert!');
  }
  catch (error) {
    assert(error, "Expected an error but did not get one");
    assert(error.message.startsWith(PREFIX + errType), "Expected an error starting with '" + PREFIX + errType + "' but got '" + error.message + "' instead");
  }
};

module.exports = { assertRevert, errTypes };
