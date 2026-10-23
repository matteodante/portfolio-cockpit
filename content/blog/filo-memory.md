---
title: "Filo: an AI that remembers you, and learns to forget"
subtitle: "I built a self-hosted conversation agent for reflecting on your own life. The hard part was not making it remember. It was a study that told me to remember less."
date: 2026-10-19
cover: images/filo-memory.jpg
coverAlt: Conceptual illustration of a linen notebook and memory cards connected by a copper thread in space.
draft: false
---

> I moved to Bologna for the new job

A month later, in the same test conversation:

> Actually the move fell through, I am still in Rome

If the agent keeps asking how Bologna is treating you, remembering has become the problem. That pair of lines is the first thing I check every time I change how [Filo](https://github.com/matteodante/filo) stores a conversation.

Filo is a small program that runs on your own computer, in a terminal or a private Telegram chat, in English or Italian. You talk to it about what is on your mind, come back a week later, and it still knows what you agreed to try and asks how it went.

It is for adult self-reflection. It is explicitly not therapy, not a diagnosis, not a crisis line, and it says so before the first message.

## Remembering is easy. Forgetting is the work

A conversation leaves traces in more than one place: the messages themselves, a summary of each session, the themes that summary mentions, and whatever facts got pulled out into structured notes. Clearing a detail from one place leaves it waiting in the others.

So "I am still in Rome" has to reach all of them. The old summary is emptied, the correction stays findable, and the original message stays in the archive, because an archive that rewrites itself would be worse than one that remembers too much. Asking Filo to forget something walks the same paths. Keeping a thing out of future replies and deleting it from disk are two different acts, and you get to choose.

The model can still get this wrong. Some of my test failures remained after the forgotten words had left every record. Knowing a fact and knowing when to leave a question unanswered turn out to be different skills.

## The study that told me to remember less

My first design extracted a lot of structured facts from every session, on the theory that structure helps you find things later. Before trusting that, I wrote down what I expected and ran a comparison on synthetic people and synthetic conversations, with eighty memory questions per setup.

Searching the past conversations did most of the work. The structured notes added five points on top, half of what I had set as the bar, and they came with a few more false memories and slightly worse conversations. There was also a bug: most sessions in the structured setup had lost their summaries to a provider error, and by the time I found it the budget was spent.

I could have argued with the numbers. Instead I made the memory smaller. Concrete details of your life now stay in the conversation archive, where search finds them in any past exchange. The structured layer keeps only what repeats: patterns, preferences, hypotheses, and the steps you agreed to try, with how they went. The [full results](https://github.com/matteodante/filo/blob/main/docs/evidence/results-2026-10.md), bug included, are in the repository.

## A guess should stay a guess

An agent will sometimes offer an interpretation that sounds right. You might agree, half agree, or change your mind in a month. I wanted the memory to keep that uncertainty instead of flattening it into a fact about you.

Every note records who introduced it, you or the agent, how well you said it fits, and whether it is still active. Agreeing with a hypothesis changes its fit; it never changes who proposed it. A later conversation can still tell the difference, and a test makes sure a correction cannot turn the agent's guess into something you said.

Nothing gets written without an exact quote from your own messages, and the transcript and the memory changes are saved together, so a failed turn leaves nothing half written.

## Changing the name

For its first three releases the project was called Therapist. The name contradicted the project's own boundary: this is an AI for reflection, not a therapist, and I did not want the word doing work the software cannot do. The rename to Filo was a clean break, down to the data directory, and the assistant now never describes itself as offering therapy or psychological support.

That decision cost a week and felt like the most important one.

## Where it stands

[Filo v0.4.0](https://github.com/matteodante/filo/blob/main/docs/releases/v0.4.0.md) is a free, self-hosted alpha under AGPL, with installers for macOS, Linux and Windows. The archive is encrypted on disk, the key kept apart. The model provider still receives what it needs to reply, and a Telegram chat is not end-to-end encrypted; the [privacy notice](https://github.com/matteodante/filo/blob/main/PRIVACY.md) spells out what is stored and how to delete it.

The next experiment is a fresh test of the smaller memory, with the bug fixed and the automated judge checked against human labels. If you are curious about memory design, or you have run a study like this and disagree with how I read mine, I would like to hear it.

## Links

- [Filo on GitHub](https://github.com/matteodante/filo): source, installers and documentation, AGPL-3.0-or-later.
- [Release notes of v0.4.0](https://github.com/matteodante/filo/blob/main/docs/releases/v0.4.0.md): what changed, including the rename from Therapist.
- [The memory study](https://github.com/matteodante/filo/blob/main/docs/evidence/results-2026-10.md): results, the bug and the amendments, with the [preregistration](https://github.com/matteodante/filo/blob/main/docs/evidence/preregistration-2026-10.md).
- [Privacy notice](https://github.com/matteodante/filo/blob/main/PRIVACY.md): what is stored, where, and how to delete it.
