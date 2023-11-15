
import { useReducer, useEffect } from 'react';
import './App.css';

import { useTranslation, Trans } from "react-i18next";
import Cookies from 'js-cookie';

import useSound from 'use-sound';
import clickSound from './Common/sounds/clickSound.mp3'

import DigitButton from './Common/Components/DigitButton/DigitButton';
import OperationButton from './Common/Components/OperationButton/OperationButton';
import Reducer from './Common/Components/Reducer/Reducer';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: ' delete-digit',
  EVALUATE: 'evaluate'
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

  useEffect(() => { document.title = t('calc_title') }, [currentLanguageCode]);

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(Reducer, {})

  const [play] = useSound(clickSound);

  const handleArClick = event => {
    i18n.changeLanguage('ar');
    play()
  }

  const handleEnClick = event => {
    i18n.changeLanguage('en');
    play()
  }

  return (
    <div className='calculator-grid'>
      <div className='output'>
        <div className='previous-operand'>{numConversion(formatOperand(previousOperand))} {operation}</div>
        <div className='current-operand'>{numConversion(formatOperand(currentOperand))}</div>
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

      <button className='span-two' onClick={() => dispatch({ type: ACTIONS.EVALUATE })} >=</button>
      {i18n.language === "en" ?
        <button
          onClick={handleArClick}
          className='span-four'
        >
          {t("en")}
        </button>
        :
        <button
          onClick={handleEnClick}
          className='span-four'
        >
          {t("en")}
        </button>}    </div>
  );
}

export default App;
