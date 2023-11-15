
import { useReducer, useEffect } from 'react';
import './App.css';


import { useTranslation, Trans } from "react-i18next";
import Cookies from 'js-cookie';


import DigitButton from './Common/Components/DigitButton/DigitButton';
import OperationButton from './Common/Components/OperationButton/OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: ' delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state
      if (payload.digit === "." && state.currentOperand.includes(".")) return state

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        }
      }
    case ACTIONS.CLEAR:
      return {}

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    case ACTIONS.EVALUATE:
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break;
    case "-":
      computation = prev - current
      break;
    case "*":
      computation = prev * current
      break;
    case "÷":
      computation = prev / current
      break;
  }
  // console.log(computation)
  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})


function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}




function App() {
  const currentLanguageCode = Cookies.get('i18next') || 'en';
  const { t, i18n } = useTranslation();

  function numSplit(num) {
    return String(num).split("").map(String);
  }

  function numConversion(ArToEn) {
    let convertedNum = []
    const currentLanguageCode = Cookies.get('i18next') || 'en';
    if (currentLanguageCode === 'ar' && ArToEn != null) {
      convertedNum = numSplit(ArToEn).map((n) => t(n, { lng: 'ar' }))
      return convertedNum.map(String);
    } else {
      return ArToEn;
    }
  }


  useEffect(() => {
    document.body.dir = currentLanguageCode === 'ar' ? 'rtl' : 'ltr';
  }, [currentLanguageCode])


  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

  return (
    <div className='calculator-grid'>
      <div className='output'>
        {console.log(numConversion("١٢٧"))}
        <div className='previous-operand'>{numConversion(formatOperand(previousOperand))} {operation}</div>
        <div className='current-operand'>{numConversion(formatOperand(currentOperand))}</div>
        {/* <div className='previous-operand'>{t(formatOperand(previousOperand))} {t(operation)}</div>
        <div className='current-operand'>{t(formatOperand(currentOperand))}</div> */}
      </div>
      <button className='span-two' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>{t("AC")}</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>{t("DEL")}</button>
      <OperationButton operation="÷" dispatch={dispatch}></OperationButton>
      <DigitButton digit="1" dispatch={dispatch}></DigitButton>
      <DigitButton digit="2" dispatch={dispatch}></DigitButton>
      <DigitButton digit="3" dispatch={dispatch}></DigitButton>
      <OperationButton operation="*" dispatch={dispatch}></OperationButton>
      <DigitButton digit="4" dispatch={dispatch}></DigitButton>
      <DigitButton digit="5" dispatch={dispatch}></DigitButton>
      <DigitButton digit="6" dispatch={dispatch}></DigitButton>
      <OperationButton operation="+" dispatch={dispatch}></OperationButton>
      <DigitButton digit="7" dispatch={dispatch}></DigitButton>
      <DigitButton digit="8" dispatch={dispatch}></DigitButton>
      <DigitButton digit="9" dispatch={dispatch}></DigitButton>
      <OperationButton operation="-" dispatch={dispatch}></OperationButton>
      <DigitButton digit="." dispatch={dispatch}></DigitButton>
      <DigitButton digit="0" dispatch={dispatch}></DigitButton>

      <button className='span-two' onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
      {i18n.language === "en" ?
        <button
          onClick={() => {
            i18n.changeLanguage('ar');
          }
          }
          className='span-four'
        >
          {t("en")}
        </button>
        :
        <button
          onClick={() => {
            i18n.changeLanguage('en');
          }
          }
          className='span-four'
        >
          {t("en")}
        </button>}    </div>
  );
}

export default App;
