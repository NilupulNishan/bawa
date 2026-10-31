# AI features

Rules for a feature that uses a model: a summary, generated text, a
suggestion, a smart sort. A model is sometimes wrong, so the design plans
for that.

## Contents

- Say where AI is used
- Keep people in control
- Show progress
- Privacy and models
- When it fails
- Check

## Say where AI is used

- Mark generated content, for example a sparkle icon and the word
  "Summary". Never pass it off as written by a person.
- Say what the feature does in plain words in its first view, not in a
  separate help page.

## Keep people in control

- Edit, Undo, and Retry sit next to every result. Accepting is one click;
  so is throwing it away.
- Show a preview before anything changes. Confirm before an action that
  cannot be undone, and never let a model start a destructive action on
  its own.
- Offer a few alternatives when people are choosing (three titles, not
  one).
- When people correct a result, use the correction and show that you did.
- Optional thumbs up or down for feedback, never a prompt that interrupts.

## Show progress

Say what the model is doing, specifically. Stream partial results as they
come in when the format allows.

| Before | After |
| --- | --- |
| Processing... | Summarizing key themes from 14 notes... |
| Thinking... | Drafting a reply to Anna... |

## Privacy and models

- A model call needs a server or an API key. Never put an API key in the
  client bundle: anyone can read it. Call the model from a small server
  route, or let people paste their own key, stored only on their device.
- When data leaves the device, say what goes, where, and why, before the
  first use.
- Where the browser has a built-in model, check that it is available
  before you show the feature.
- Ask how the feature could be misused and who it could harm. Drop it when
  the risk is bigger than the value.

## When it fails

- The model is unavailable (no network, no key, a rate limit): the feature
  explains why and the app still works without it. Every AI action has a
  manual path.
- A refused or blocked request says so plainly and shows an example of an
  input that works: "Unable to use that description. Try: a short note
  about a meeting."
- A wrong result costs one click to undo, never a person's work.

## Check

Done when generated content is marked, every result has Edit, Undo, and
Retry, progress text names the task, the feature works or explains itself
with the model unavailable, no API key ships in the bundle, and nothing
destructive runs without a confirmation.
