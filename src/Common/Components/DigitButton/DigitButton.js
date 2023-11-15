import React from 'react'
import { ACTIONS } from '../../../App'
import { useTranslation, Trans } from "react-i18next";


export default function DigitButton({ dispatch, digit }) {
    const { t, i18n } = useTranslation();
    return (
        <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}>{t(digit)}</button>
    )
}
