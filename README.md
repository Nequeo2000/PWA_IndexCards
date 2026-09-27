# PWA_IndexCards

A Progressive Web App (PWA) showing a very simple implementation of an index cards learning app.

## How is an input file structured

An input file is a JSON-file listing the desired questions as such:

```
{
  "questions": [
    {"q": "What is 'hello' in spanish?", "a": "Hola!", "time": 10},
    {"q": "Where does the answer go?", "a": "Here!", "time": 15}
  ]
}
```

| Name       | Function  |
| :--------- | :-------- |
| questions   | A list of questions. |
| q | A Question as a String. |
| a | The Answer to the question. |
| t | The time given to answer correctly. After the time is up, the correct answer will be revealed for a few seconds. |