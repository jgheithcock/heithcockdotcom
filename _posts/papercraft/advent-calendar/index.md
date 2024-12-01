---
title: "Advent Calendar"
excerpt: "A Hogsmeade inspired advent calendar"
coverImage:
  src: "/images/papercraft/advent-calendar/calendar-facing.jpg"
  alt: "Hogsmeade inspired advent calendar"
  width: 954
  height: 1157
date: "2024-12-01"
author:
  name: JG Heithcock
  picture: "/assets/blog/authors/jg.jpeg"
ogImage:
  url: "/images/papercraft/advent-calendar/calendar-facing.jpg"
---

My daughter had asked for an advent calendar for December. I decided to make her one. I showed the missus my initial take - a simple image of a cottage I found off the internet with numbers and doors cut in. She challenged me to make something a bit more complicated, "playing to my skills." I ended up going with the following, inspired from one from [Pottery Barn](https://www.potterybarn.com/products/glitter-lit-houses-advent-calendar/?catalogId=84&sku=1933782).

<a href="/images/papercraft/advent-calendar/calendar-facing.jpg">
<img src="/images/papercraft/advent-calendar/calendar-facing.jpg" class="mapBorder parchment" alt="A Hogsmeade inspired advent calendar" />
</a>

For the girl, I made [tempered chocolate](https://www.valrhona.com/en/l-ecole-valrhona/discover-l-ecole-valrhona/chocolate-terminology/tempering-chocolate), two for each date (one for her and one for her partner) and also put in a mini-lego from a prior year's [Lego Advent calendar](https://brickset.com/sets/2824-1/LEGO-City-Advent-Calendar).

<a href="/images/papercraft/advent-calendar/tempered-chocolate.jpg">
<img src="/images/papercraft/advent-calendar/tempered-chocolate.jpg" class="mapBorder parchment" alt="Tempered chocolate" />
</a>

<a href="/images/papercraft/advent-calendar/jg-oven.jpg">
<img src="/images/papercraft/advent-calendar/jg-oven.jpg" class="mapBorder parchment" alt="Showing off before sending" />
</a>

The missus had a lot of design input, aside from pushing me to do more. She was the one that pushed for the red roofs as well as the trees.

After I finished the one for the girl, the missus said "You know, my Mom was wanting an advent calendar. It would be super cool for you to do one for her!" For that one, I let her do the trees.

<a href="/images/papercraft/advent-calendar/suzy-trees.jpg">
<img src="/images/papercraft/advent-calendar/suzy-trees.jpg" class="mapBorder parchment" alt="Better trees" />
</a>

While it is a bit overkill to do so much on what is the back of the calendar, it did come out well!

<a href="/images/papercraft/advent-calendar/advent-calendar.jpg">
<img src="/images/papercraft/advent-calendar/advent-calendar.jpg" class="mapBorder parchment" alt="The finished product" />
</a>

<hr />

## Behind the Scenes

I did the design work in Photoshop and used my Cricut Air to cut out each of the houses. I made a 12" wide 16" tall document and came up with three different sized houses that I was going to scatter around, carefully doing the math to make sure it would all fit. My wife said it looked a mess and I should follow what the inspiration layout was. So...sigh..., I threw out that work and made a template of the houses over a screenshot, resized to be 12"x16".

<a href="/images/papercraft/advent-calendar/behind-the-scenes/advent-design.png">
<img src="/images/papercraft/advent-calendar/behind-the-scenes/advent-design.png" class="mapBorder parchment" alt="Front outlines of each house" />
</a>

There were some minor changes but after getting sign off from the art director, I then came up with the design for the house.

<a href="/images/papercraft/advent-calendar/behind-the-scenes/new-outline.png">
<img src="/images/papercraft/advent-calendar/behind-the-scenes/new-outline.png" class="mapBorder parchment" alt="Outline of house in Photoshop" />
</a>

I really, really didn't want to hand do each house, especially as the roofs required math to get the distance right. I first looked at using a spreadsheet to calculate the guidelines I'd need to hand create and then thought, I wonder if I could script this in Photoshop. Turns out [you can](https://gist.github.com/jgheithcock/44f93ecd70fd070fef3a9b32f6101ae0)! (Adobe has quite a bit of information on [Scripting Photoshop](https://developer.adobe.com/photoshop/uxp/2022/ps_reference/).)

<div class="note">

### Cricut Note

One of the many issues using Cricut Design is that there is no bulk uploader of images. Again, I did not want to do that for 24 houses (as it is a very time-intensive process) so I wrote a second [Photoshop script to export each visible vector layer into a single SVG file](https://gist.github.com/jgheithcock/1b5a4c1d81117d211a86106f1a40a6eb).

The other thing that I finally figured out was that I needed to keep the cut lines for each door separate from the house outline, as they did not get cut out when combined. The secret is to _first_ select all the elements you wish to have removed from the house outline (which I needed several times as not all the images were SVG). This excludes the door frame and has the house outline last. Choose `Combine > Subtract`. This sadly sends the result to the top of the list with the name "Subtract". Move the door to be on top of this, and then choose `Attach` which again sends this to the top of the list (were you so foolish as to move it back to where you wanted it) with the name "Attach". Now you can rename and reposition the new group.

</div>

For the numbers, I used a stencil font called [Archer](https://fontpark.com/en/archer.font), for the icons, I scavenged them off the internet and Cricut's free images. Most needed tweeking in Photoshop for the size I was using.

Hoping your December is merry....

<a href="/images/papercraft/advent-calendar/behind-the-scenes/lined-up.jpg">
<img src="/images/papercraft/advent-calendar/behind-the-scenes/lined-up.jpg" class="mapBorder parchment" alt="Lined up" />
</a>
