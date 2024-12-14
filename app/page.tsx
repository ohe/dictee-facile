'use client';

import { useState, FormEvent, ChangeEvent, KeyboardEvent } from 'react';
import { askMistral } from './actions';

interface FormData {
  level: string;
  words: string[];
  verbs: string[];
  tenses: string[];
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    level: '',
    words: [],
    verbs: [],
    tenses: [],
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let text = 'No response';
    const chatResponse = await askMistral(formData);

    if (chatResponse.choices && chatResponse.choices.length > 0) {
      text = (chatResponse.choices[0].message.content || "") as string;
    }

    setResponse(text);
    setLoading(false);
  };

  const handleWordChange = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === ',') {
      e.preventDefault();
      setFormData({
        ...formData,
        words: [...formData.words, e.currentTarget.value.trim()],
      });
      e.currentTarget.value = '';
    }
  };

  const handleVerbChange = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === ',') {
      e.preventDefault();
      setFormData({
        ...formData,
        verbs: [...formData.verbs, e.currentTarget.value.trim()],
      });
      e.currentTarget.value = '';
    }
  };

  const handleTenseChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData({
      ...formData,
      tenses: checked
        ? [...formData.tenses, value]
        : formData.tenses.filter(tense => tense !== value),
    });
  };

  const removeWord = (word: string) => {
    setFormData({
      ...formData,
      words: formData.words.filter(w => w !== word),
    });
  };

  const removeVerb = (verb: string) => {
    setFormData({
      ...formData,
      verbs: formData.verbs.filter(v => v !== verb),
    });
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Niveau:</label>
        <select
        value={formData.level}
        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
        <option value="">Sélectionnez un niveau</option>
        <option value="CP">CP</option>
        <option value="CE1">CE1</option>
        <option value="CE2">CE2</option>
        <option value="CM1">CM1</option>
        <option value="CM2">CM2</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Mots:</label>
        <p className="text-xs text-gray-500 mt-1 flex items-center">
          <span className="mr-1">Appuyer sur</span>
          <span className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded mr-1">␣</span>
          <span className="mr-1">ou</span>
          <span className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded mr-1">,</span>
          <span>pour valider un mot</span>
        </p>
        <input
        type="text"
        onKeyPress={handleWordChange}
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <div className="mt-2 flex flex-wrap">
        {formData.words.map((word, index) => (
          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mr-2 mb-2">
          {word}
          <button type="button" onClick={() => removeWord(word)} className="ml-1 text-indigo-500 hover:text-indigo-700">
            &times;
          </button>
          </span>
        ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Verbes:</label>
        <p className="text-xs text-gray-500 mt-1 flex items-center">
          <span className="mr-1">Appuyer sur</span>
          <span className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded mr-1">␣</span>
          <span className="mr-1">ou</span>
          <span className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded mr-1">,</span>
          <span>pour valider un mot</span>
        </p>
        <input
        type="text"
        onKeyPress={handleVerbChange}
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <div className="mt-2 flex flex-wrap">
        {formData.verbs.map((verb, index) => (
          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mr-2 mb-2">
          {verb}
          <button type="button" onClick={() => removeVerb(verb)} className="ml-1 text-indigo-500 hover:text-indigo-700">
            &times;
          </button>
          </span>
        ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Temps:</label>
        <div className="mt-2 space-y-2">
        <label className="inline-flex items-center">
          <input type="checkbox" value="présent" onChange={handleTenseChange} className="form-checkbox h-4 w-4 text-indigo-600" />
          <span className="ml-2 text-sm text-gray-700">Présent</span>
        </label>
        <br />
        <label className="inline-flex items-center">
          <input type="checkbox" value="futur simple" onChange={handleTenseChange} className="form-checkbox h-4 w-4 text-indigo-600" />
          <span className="ml-2 text-sm text-gray-700">Futur simple</span>
        </label>
        <br />
        <label className="inline-flex items-center">
          <input type="checkbox" value="imparfait" onChange={handleTenseChange} className="form-checkbox h-4 w-4 text-indigo-600" />
          <span className="ml-2 text-sm text-gray-700">Imparfait</span>
        </label>
        <br />
        <label className="inline-flex items-center">
          <input type="checkbox" value="passé simple" onChange={handleTenseChange} className="form-checkbox h-4 w-4 text-indigo-600" />
          <span className="ml-2 text-sm text-gray-700">Passé simple</span>
        </label>
        <br />
        <label className="inline-flex items-center">
          <input type="checkbox" value="passé composé" onChange={handleTenseChange} className="form-checkbox h-4 w-4 text-indigo-600" />
          <span className="ml-2 text-sm text-gray-700">Passé composé</span>
        </label>
        </div>
      </div>
      <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Submit
      </button>
      </form>
      {loading && <p className="mt-4 text-center text-gray-600">Loading...</p>}
      {response && (
      <div className="mt-4 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50">
        <p className="text-gray-700">{response}</p>
      </div>
      )}
    </div>
  );
}
