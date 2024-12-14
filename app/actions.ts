'use server'

import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({apiKey: apiKey});


export async function askMistral(formData: any) {

    const level = formData.level;
    const words = formData.words.join(",");
    const verbs = formData.verbs.join(",");
    const tenses = formData.tenses.join(",");

    const prompt = `
Tu es un professeur de ${ level }.
Tu dois fournir une dictée comportement imperativement les mots suivants:

${ words }

Il doit contenir également impérativement les verbes suivants:

${ verbs }

Les verbes peuvent être conjugués uniquement au temps suivants:

${ tenses }

La dictée doit êtret la plus concise possible mais doit imperativement reprendre tous les mots et verbes fournis, c'est très important.
Ecris moi une dictée en respectant le vocabulaire d'un enfant de ${ level }. La réponse ne doit contenir que le texte de la dictée.
`
    console.log(prompt);
    return await client.chat.complete({
        model: "mistral-large-latest",
        messages: [{role: 'user', content: prompt}]
    });
}
