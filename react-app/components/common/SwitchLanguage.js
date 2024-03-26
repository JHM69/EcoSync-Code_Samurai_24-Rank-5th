/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react'

const SwitchLanguage = () => {
  // Initializing language state to 'en' for English
  const [language, setLanguage] = useState('en')

  // Function to toggle language between English and Bengali
  const toggleLanguage = () => {
    setLanguage((currentLanguage) => (currentLanguage === 'en' ? 'bn' : 'en'))
  }

  return (
    <div className={`language-switch ${language === 'bn' ? 'active-bn' : ''}`}>
      <div className="language-option en" onClick={() => setLanguage('en')}>
        En
      </div>
      <div className="language-option bn" onClick={() => setLanguage('bn')}>
        বাংলা
      </div>
    </div>
  )
}

export default SwitchLanguage
