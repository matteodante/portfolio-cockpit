---
title: "Why I built an app that erases a drone's own shadow"
subtitle: "DroneClean started as a question on my own PC in late September and went online three weeks later. This is what the shadow taught me, and what I would do again."
date: 2026-10-23
updated: 2026-11-19
cover: images/droneclean.jpg
coverAlt: "The same patch of wet sand twice, side by side: on the left a drone's shadow, on the right the DroneClean output without it."
draft: false
---

Every drone pilot has this shot. The light is perfect, the sea is doing its thing, and right in the middle of the sand there is a small dark quadcopter, propellers and all. The sun is behind you, the drone is low, and its shadow falls exactly where the camera is looking.

I kept seeing that shot in creators' videos, and I kept seeing it thrown away. So in late September I asked myself a narrow question: could a video go in, the pilot tap the shadow once, and the video come back without it, with everything else untouched?

[DroneClean](https://droneclean.app) is the answer, three weeks later. You open the clip in the browser, tap the shadow on a frame where it shows, and the app follows it through the footage and paints it out. The rest of the picture and the sound come back as they were. It has been online since mid-October, free while the beta lasts.

![The DroneClean landing page in a desktop browser: the title, the two actions and the start of the launch film.](images/droneclean-landing.jpg)

The landing page in October 2026. The cover of this article is the site's own before and after on a beach clip from Pexels; the "after" is a real output.

## The shadow is never where you want it

I started with one real clip and a graphics card on my desk. The first attempts removed the shadow in the sense that it got lighter. At normal speed you still saw it: a pale ghost gliding over the grass, a drone-shaped smudge on the snow. I wrote in my notes that it was not convincing, and that was the kindest word.

That ghost became the whole project. A shadow is not an object you can cut out; it is the ground with less light on it, and the ground under a moving drone is sand, gravel, cracked asphalt, wet grass, road markings. Make it too smooth and the eye notices a patch that does not belong. Leave too much and the drone is still there.

I went through several approaches over a couple of weeks of evenings and nights. Some looked wonderful on one surface and fell apart on the next. What finally worked was giving up on a single trick and letting the results choose: I put the candidates side by side on thirteen real clips, hid which was which, and voted. The one that won most of them is the engine that runs today.

## The decisions that were not about the engine

The engine was half the work. The other half was a list of product decisions I did not expect to care about so much.

You pay only for the seconds where the shadow actually shows. Following it through the clip is free, and so is a short preview on your own footage. It felt wrong to charge for a whole minute because a shadow crossed the frame for four seconds.

You do not upload the whole video to see whether it works. Drone footage is big, and a pilot on a phone in a field should not wait for a two-gigabyte upload before finding out whether the thing even found the shadow. The full upload happens only when you decide to export.

The export must not be worse than the original. Creators shoot ten-bit log footage and ProRes, and the first version quietly turned everything into ordinary eight-bit video. That would have defeated the product. Now the file you get back keeps the format you gave, and only the part that changed is touched.

## What it still gets wrong

Tracking can mistake a real drone in the frame for its shadow, and it can lose the shadow when two shadows cross. In one game capture it took the cracks on an iceberg's shaded face for the shadow itself.

I could add a rule that catches that case, but the same rule would drop a real shadow that grows as the drone descends. So the honest fix lives in the browser app: the highlighted ranges are yours to trim or delete before you export.

The repair is generated detail, and on a very large shadow in 4K it is softer than the sand around it. I say so on the site instead of hoping nobody zooms in.

## The shadow removal moved into a free editor

I fly a DJI Avata 2, and my own footage goes through Gyroflow to steady it, then DaVinci Resolve to cut, grade and export it. A shadow remover on a website is one more stop on that road, with one more upload. Pilots, me included, want one place to stabilize, grade, cut and clean.

So in November the shadow removal became the one paid effect of [DroneClean Studio](https://github.com/matteodante/droneclean-studio), a free video editor for drone and FPV pilots. Most of it is other people's work. Studio is a fork of [FreeCut](https://github.com/walterlow/freecut), the only open-source editor I tried that handled my 4K 60 fps clips smoothly, with [Gyroflow](https://github.com/gyroflow/gyroflow)'s engine inside it to steady the picture from the drone's own gyro data.

Gyroflow is GPL, so Studio's code is public too. It is also local first: projects and footage stay on your computer. To clean a shadow you trim the clip to the seconds that need it, click the shadow once and see the price in credits. Only that piece goes up to DroneClean's cloud and comes back cleaned on the timeline. The engine behind it stays closed.

The October rule that the export must not be worse than the original came with me, and the browser made it harder. Chrome turned out unable to encode ten-bit HEVC at all, and it hands ten-bit footage to the graphics card as eight bits. So the web version exports eight-bit and says so, and the Mac app carries its own FFmpeg for ten-bit ProRes and HEVC masters.

AI coding agents wrote Studio's own code in parallel waves, from the plan on 18 November to a public release the next evening. The price is that between reviews nobody reads every line, so automated tests and stored reference frames carry the quality, and I judge the results on my own flights. Agents can use Studio too: through its MCP server, Claude or another agent can make the first cut.

Today DroneClean Studio 0.1.2 runs on Macs with Apple silicon, not signed by Apple yet, and the same editor opens in Chrome or Edge at [droneclean.app/studio](https://droneclean.app/studio/). Windows is not out yet. The browser app from October is still online for anyone who only wants a clip cleaned, and credits are still free while the beta lasts.

## What I learned

Judge at normal speed, on real footage, with the answer hidden. Every metric I computed agreed with my eyes less than a blind vote did.

The product is the whole path, not the clever part. What to upload, what to charge for, and what to promise about the output file took as many evenings as the engine, and users notice them first.

Say what fails. A tool that erases shadows and admits where it cannot is one I would trust with my own footage.

AI coding agents wrote a lot of this code with me, in long sessions, and I made every call by looking at the result. If you fly, [try it on a clip of yours](https://droneclean.app). If you build things like this, I would enjoy comparing notes.

## Links

- [DroneClean](https://droneclean.app): the site, with DroneClean Studio and the shadow removal; credits are free during the beta.
- [Clean a video in the browser](https://droneclean.app/remove): the app this article describes, still online; sign in with Google.
- [DroneClean Studio on GitHub](https://github.com/matteodante/droneclean-studio): the editor's source code under GPL-3.0, and how to build it.
- [Download DroneClean Studio](https://github.com/matteodante/droneclean-studio/releases/latest): the Mac app for Apple silicon, not signed by Apple yet. The same editor runs in the browser at [droneclean.app/studio](https://droneclean.app/studio/).
- [How it works and what it costs after the beta](https://droneclean.app/#faq): the questions and answers on the site.
