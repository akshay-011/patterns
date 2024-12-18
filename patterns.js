const NEW_LINE = "\n";
const STAR = "*";
const EMPTY = "";
const SPACE = " ";
const DASH = "-";
const symbols = [STAR, DASH, SPACE];

function toString(screen) {
  const string = [];

  for (const line of screen) {
    string.push(line.join(''));
  }

  return string.join(NEW_LINE);
}

function createArrayOf(length, character) {
  const array = [];

  for (let index = 0; index < length; index++) {
    array.push(character);
  }

  return array;
}

function createFilledFrame(breadth, length, character) {
  const screen = [];

  for (let column = 0; column < length; column++) {
    const row = createArrayOf(breadth, character);
    screen.push(row);
  }

  return screen;
}

function putPixel(screen, character, x, y) {
  screen[y][x] = character;
}

function drawVerticalLine(screen, x, y1, y2, character) {
  for (let y = y1; y <= y2; y++) {
    putPixel(screen, character, x, y);
  }
}

function drawHorizontalLine(screen, y, x1, x2, character) {
  for (let x = x1; x <= x2; x++) {
    putPixel(screen, character, x, y);
  }
}

function drawRectangleBorder(screen, endX, endY, border) {
  drawVerticalLine(screen, 0, 0, endY, border);
  drawVerticalLine(screen, endX, 0, endY, border);

  drawHorizontalLine(screen, 0, 0, endX, border);
  drawHorizontalLine(screen, endY, 0, endX, border);
}

function createHollowRectangle(breadth, length, border) {
  const screen = createFilledFrame(breadth, length, SPACE);
  drawRectangleBorder(screen, breadth - 1,length - 1, border);

  return screen;
}

function alternateRectangle(breadth, length, numberOfChars) {
  const rectangle = [];

  for (let line = 0; line < length; line++) {
    const charIndex = line % numberOfChars;
    const rowArray = createArrayOf(breadth, symbols[charIndex])
    rectangle.push(rowArray);
  }

  return rectangle;
}

function filledArray(length, charCount, characters) {
  const array = createArrayOf(length, characters[1]);

  for (let index = length - charCount; index < length; index++) {
    array[index] = characters[0];
  }

  return array;
}

function createTriangle(size, character, filler) {
  const screen = [];

  for (let line = 1; line <= size; line++) {
    const row = filledArray(size, line, [character, filler]);
    screen.push(row);
  }

  return screen;
}

function rightInclinedLine(screen, from, to, character) {
  let x1 = from[0];

  for (let y1 = from[1]; y1 <= to[1]; y1++) {
    putPixel(screen, character, x1, y1);
    x1--;
  }
}

function leftInclinedLine(screen, from, to, character) {
  let x1 = from[0];

  for (let y1 = from[1]; y1 <= to[1]; y1++) {
    putPixel(screen, character, x1, y1);
    x1++;
  }
}

function convertToOdd(number) {
  const substractor = number % 2 === 0 ? 1 : 0;

  return number - substractor;
}

function createDiamond(size, character) {
  return [[]];
}

function drawDiamondBorder(diamond, center, end, character) {
  rightInclinedLine(diamond, [center, 0], [0, center], character);
  rightInclinedLine(diamond, [end, center], [center, end], character);

  leftInclinedLine(diamond, [center, 0], [end, center], character);
  leftInclinedLine(diamond, [0, center], [center, end], character);
}

function hollowDiamond(size, character) {
  const newSize = convertToOdd(size);
  const diamond = createFilledFrame(newSize, newSize, SPACE);
  const center = Math.floor(newSize / 2);

  drawDiamondBorder(diamond, center, newSize - 1, character);

  return diamond;
}

function generateRectanglePattern(style, dimensions) {
  const breadth = dimensions[0];
  const length = dimensions[1];

  switch (style) {
    case "filled-rectangle":
      return createFilledFrame(breadth, length, STAR);
    case "hollow-rectangle":
      return createHollowRectangle(breadth, length, STAR);
    case "alternating-rectangle":
      return alternateRectangle(breadth, length, 2);
    case "spaced-alternating-rectangle":
      return alternateRectangle(breadth, length, 3);
  }
}

function generateTrianglePattern(style, dimensions) {
  const fillers = [EMPTY, SPACE];
  const styles = [
    "triangle",
    "right-aligned-triangle",
    "diamond",
    "hollow-diamond",
  ];

  const index = styles.indexOf(style);
  if (index === 2) {
    return createDiamond(dimensions[0], STAR);
  }

  if (index === 3) {
    return hollowDiamond(dimensions[0], STAR);
  }

  return createTriangle(dimensions[0], STAR, fillers[index]);
}

function createPattern(style, dimensions) {
  if (dimensions.length === 2) {
    return generateRectanglePattern(style, dimensions);
  }

  if (dimensions.length === 1) {
    return generateTrianglePattern(style, dimensions);
  }

}

function generatePattern(style1, dimensions, style2) {
  if (dimensions[0] < 1 || dimensions[1] < 1) {
    return '';
  }

  const pattern1 = createPattern(style1, dimensions);

  if (style2 === '' || style2 === undefined) {
    return toString(pattern1);
  }

  const pattern2 = createPattern(style2, dimensions);
  const pattern = pattern2;

  return toString(pattern);
}

// tesing part
function testGeneratePattern(style1, dimensions, style2, expected, failed) {
  const actual = generatePattern(style1, dimensions, style2);
  if (actual !== expected) {
    failed.push([style1, style2, dimensions, actual, expected]);
  }
}

function testFilledRectangle(failed) {
  testGeneratePattern('filled-rectangle', [1, 0], "", '', failed);
  testGeneratePattern('filled-rectangle', [0, 1], "", '', failed);
  testGeneratePattern('filled-rectangle', [1, 1], "", '*', failed);
  testGeneratePattern('filled-rectangle', [2, 1], "", '**', failed);
  testGeneratePattern('filled-rectangle', [2, 2], "", '**\n**', failed);
  testGeneratePattern('filled-rectangle', [3, 2], "", '***\n***', failed);
  testGeneratePattern('filled-rectangle', [3, 3], "", '***\n***\n***', failed);
  testGeneratePattern('filled-rectangle', [3, 4], "", '***\n***\n***\n***', failed);
}

function testHollow(failed) {
  testGeneratePattern('hollow-rectangle', [1, 0], "", '', failed);
  testGeneratePattern('hollow-rectangle', [0, 1], "", '', failed);
  testGeneratePattern('hollow-rectangle', [2, 2], "", '**\n**', failed);
  testGeneratePattern('hollow-rectangle', [2, 3], "", '**\n**\n**', failed);
  testGeneratePattern('hollow-rectangle', [3, 3], "", '***\n* *\n***', failed);
  testGeneratePattern('hollow-rectangle', [3, 3], "", '***\n* *\n***', failed);
  testGeneratePattern('hollow-rectangle', [3, 4], "", '***\n* *\n* *\n***', failed);
  testGeneratePattern('hollow-rectangle', [4, 4], "", '****\n*  *\n*  *\n****', failed);
  testGeneratePattern('hollow-rectangle', [3, 6], "", '***\n* *\n* *\n* *\n* *\n***', failed);
}

function testAlternate(failed) {
  testGeneratePattern('alternating-rectangle', [1, 1], "", '*', failed);
  testGeneratePattern('alternating-rectangle', [1, 1], "", '*', failed);
  testGeneratePattern('alternating-rectangle', [1, 2], "", '*\n-', failed);
  testGeneratePattern('alternating-rectangle', [2, 2], "", '**\n--', failed);
  testGeneratePattern('alternating-rectangle', [2, 3], "", '**\n--\n**', failed);
  testGeneratePattern('alternating-rectangle', [3, 3], "", '***\n---\n***', failed);
  testGeneratePattern('alternating-rectangle', [3, 4], "", '***\n---\n***\n---', failed);
}

function testTriangle(failed) {
  testGeneratePattern('triangle', [0], "", '', failed);
  testGeneratePattern('triangle', [1], "", '*', failed);
  testGeneratePattern('triangle', [2], "", '*\n**', failed);
  testGeneratePattern('triangle', [3], "", '*\n**\n***', failed);
  testGeneratePattern('triangle', [4], "", '*\n**\n***\n****', failed);
  testGeneratePattern('triangle', [5], "", '*\n**\n***\n****\n*****', failed);
}

function testRightAlignedTraiangle(failed) {
  testGeneratePattern('right-aligned-triangle', [0], "", '', failed);
  testGeneratePattern('right-aligned-triangle', [1], "", '*', failed);
  testGeneratePattern('right-aligned-triangle', [2], "", ' *\n**', failed);
  testGeneratePattern('right-aligned-triangle', [3], "", '  *\n **\n***', failed);
  testGeneratePattern('right-aligned-triangle', [4], "", '   *\n  **\n ***\n****', failed);
  testGeneratePattern('right-aligned-triangle', [5], "", '    *\n   **\n  ***\n ****\n*****', failed);
}

function testSpaceAlternateRectangle(failed) {
  testGeneratePattern('spaced-alternating-rectangle', [1, 1], "", '*', failed);
  testGeneratePattern('spaced-alternating-rectangle', [1, 2], "", '*\n-', failed);
  testGeneratePattern('spaced-alternating-rectangle', [1, 3], "", '*\n-\n ', failed);
  testGeneratePattern('spaced-alternating-rectangle', [2, 3], "", '**\n--\n  ', failed);
  testGeneratePattern('spaced-alternating-rectangle', [2, 4], "", '**\n--\n  \n**', failed);
  testGeneratePattern('spaced-alternating-rectangle', [2, 5], "", '**\n--\n  \n**\n--', failed);
  testGeneratePattern('spaced-alternating-rectangle', [2, 6], "", '**\n--\n  \n**\n--\n  ', failed);
}

function testDiamond(failed) {
  testGeneratePattern('diamond', [1], "", '*', failed);
  testGeneratePattern('diamond', [2], "", '*', failed);
  testGeneratePattern('diamond', [3], "", ' *\n***\n *', failed);
  testGeneratePattern('diamond', [4], "", ' *\n***\n *', failed);
  testGeneratePattern('diamond', [5], "", '  *\n ***\n*****\n ***\n  *', failed);
  testGeneratePattern('diamond', [6], "", '  *\n ***\n*****\n ***\n  *', failed);
  testGeneratePattern('diamond', [7], "", '   *\n  ***\n *****\n*******\n *****\n  ***\n   *', failed);
}

function testHollowDiamond(failed) {
  testGeneratePattern('hollow-diamond', [1], "", '*', failed);
  testGeneratePattern('hollow-diamond', [2], "", '*', failed);
  testGeneratePattern('hollow-diamond', [3], "", ' *\n* *\n *', failed);
  testGeneratePattern('hollow-diamond', [4], "", ' *\n* *\n *', failed);
  testGeneratePattern('hollow-diamond', [5], "", "  *\n * *\n*   *\n * *\n  *", failed);
}

function testDoubleThings(failed) {
  testGeneratePattern('filled-rectangle', [3, 3], 'hollow-rectangle', "*** ***\n*** * *\n*** ***", failed);
  testGeneratePattern('diamond', [5], 'hollow-diamond', "", failed);

}

function testAll() {
  const failed = [];

  testFilledRectangle(failed);
  testHollow(failed);
  testAlternate(failed);
  testTriangle(failed);
  testRightAlignedTraiangle(failed);
  testSpaceAlternateRectangle(failed);
  // testDiamond(failed);
  testHollowDiamond(failed);
  // testDoubleThings(failed);

  console.table(failed)
}

testAll();
