/*

  a bootstrap like style

*/
'use strict';
858591
var LABEL_COLOR = '#858591';
var INPUT_COLOR = '#1D1D26';
var ERROR_COLOR = '#a94442';
var HELP_COLOR = '#999999';
var BORDER_COLOR = '#ffffff';
var DISABLED_COLOR = '#777777';
var DISABLED_BACKGROUND_COLOR = '#eeeeee';
var FONT_SIZE = 17;
var FONT_WEIGHT = 'normal';
var FONT_FAMiLY = 'Avenir';
var LETTER_SPACING = 0;
var OPACITY = 1;
var SEPARATOR_BORDER_COLOR = '#cccccc';

var stylesheet = Object.freeze({
  fieldset: {},
  // the style applied to the container of all inputs
  formGroup: {
    normal: {
      marginBottom: 5,
      borderBottomWidth: 1,
      borderBottomColor: SEPARATOR_BORDER_COLOR
    },
    error: {
      marginBottom: 5
    }
  },
  controlLabel: {
    normal: {
      color: LABEL_COLOR,
      fontSize: FONT_SIZE,
      fontFamily: FONT_FAMiLY,
      letterSpacing: LETTER_SPACING,
      opacity: OPACITY,   
      alignSelf: 'center',
      fontWeight: FONT_WEIGHT
    },
    // the style applied when a validation error occours
    error: {
      color: ERROR_COLOR,
      fontSize: FONT_SIZE,
      fontFamily: FONT_FAMiLY,
      letterSpacing: LETTER_SPACING,
      opacity: OPACITY,
      marginBottom: 7,
      fontWeight: FONT_WEIGHT
    }
  },
  helpBlock: {
    normal: {
      color: HELP_COLOR,
      fontSize: FONT_SIZE,
      fontFamily: FONT_FAMiLY,
      letterSpacing: LETTER_SPACING,
      opacity: OPACITY,
      marginBottom: 2
    },
    // the style applied when a validation error occours
    error: {
      color: HELP_COLOR,
      fontSize: FONT_SIZE,
      fontFamily: FONT_FAMiLY,
      letterSpacing: LETTER_SPACING,
      opacity: OPACITY,
      marginBottom: 2
    }
  },
  errorBlock: {
    fontSize: FONT_SIZE,
    fontFamily: FONT_FAMiLY,
    letterSpacing: LETTER_SPACING,
    opacity: OPACITY,
    marginBottom: 2,
    color: ERROR_COLOR
  },
  textbox: {
    inputfont:{
      color: INPUT_COLOR,
      fontSize: FONT_SIZE,
      fontFamily: FONT_FAMiLY,
      letterSpacing: LETTER_SPACING,
    },
    normal: {
      color: INPUT_COLOR,
      fontSize: FONT_SIZE,
      fontFamily: FONT_FAMiLY,
      letterSpacing: LETTER_SPACING,
      height: 36,
      borderRadius: 4,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
    },
    // the style applied when a validation error occours
    error: {
      color: INPUT_COLOR,
      fontSize: FONT_SIZE,
      fontFamily: FONT_FAMiLY,
      letterSpacing: LETTER_SPACING,
      opacity: OPACITY,
      height: 36,
      padding: 7,
      borderRadius: 4,
      borderColor: ERROR_COLOR,
      borderWidth: 1,
      marginBottom: 5
    },
    // the style applied when the textbox is not editable
    notEditable: {
      fontSize: FONT_SIZE,
      fontFamily: FONT_FAMiLY,
      letterSpacing: LETTER_SPACING,
      opacity: OPACITY,
      height: 36,
      padding: 7,
      borderRadius: 4,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      marginBottom: 5,
      color: DISABLED_COLOR,
      backgroundColor: DISABLED_BACKGROUND_COLOR
    }
  },
  checkbox: {
    normal: {
      marginBottom: 4
    },
    // the style applied when a validation error occours
    error: {
      color: INPUT_COLOR,
      marginBottom: 4
    }
  },
  select: {
    normal: {
      marginBottom: 4
    },
    // the style applied when a validation error occours
    error: {
      marginBottom: 4
    }
  },
  datepicker: {
    normal: {
      marginBottom: 4
    },
    // the style applied when a validation error occours
    error: {
      marginBottom: 4
    }
  }
});

module.exports = stylesheet;