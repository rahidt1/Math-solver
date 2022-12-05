const input = document.querySelector("#equation");
const output = document.querySelector("#results");
const form = document.querySelector("#equation-form");

// Regular Expresions
//////////////////////////////////////////////////////

const PARENTHESIS_REGEX = /\((?<equation>[^\(\))]*)\)/;
const EXPONENT_REGEX =
  /(?<operand1>\S+)\s*(?<operation>[\^])\s*(?<operand2>\S+)/;
const MULTIPLY_DIVIDE_REGEX =
  /(?<operand1>\S+)\s*(?<operation>[\/\*])\s*(?<operand2>\S+)/;
const ADD_SUBTRACT_REGEX =
  /(?<operand1>\S+)\s*(?<operation>(?<!e)[\+\-])\s*(?<operand2>\S+)/;

// Helper Function
/////////////////////////////////////////////////////

// Handle Math equation
const handleMath = function ({ operand1, operand2, operation }) {
  const number1 = parseFloat(operand1);
  const number2 = parseFloat(operand2);

  switch (operation) {
    case "/":
      return number1 / number2;
    case "*":
      return number1 * number2;
    case "+":
      return number1 + number2;
    case "-":
      return number1 - number2;
    case "^":
      return number1 ** number2;
  }
};

// Parse Equation
const handleEquation = function (equation, regex) {
  const result = handleMath(equation.match(regex).groups);
  const newEquation = equation.replace(regex, result);

  return parse(newEquation);
};

// Parse Input
const parse = function (equation) {
  // Solve parenthesis
  if (equation.match(PARENTHESIS_REGEX)) {
    const subEquation = equation.match(PARENTHESIS_REGEX).groups.equation;
    const result = parse(subEquation);
    const newEquation = equation.replace(PARENTHESIS_REGEX, result);

    return parse(newEquation);
  }

  // Solve exponent
  else if (equation.match(EXPONENT_REGEX)) {
    return handleEquation(equation, EXPONENT_REGEX);
  }

  // Solve multiplication/division
  else if (equation.match(MULTIPLY_DIVIDE_REGEX)) {
    return handleEquation(equation, MULTIPLY_DIVIDE_REGEX);
  }

  // Solve addition/subtraction
  else if (equation.match(ADD_SUBTRACT_REGEX))
    return handleEquation(equation, ADD_SUBTRACT_REGEX);
  else {
    return parseFloat(equation);
  }
};

////////////////////////////////////////////////////
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const result = parse(input.value);

  output.textContent = result;
});
