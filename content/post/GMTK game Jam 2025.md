---
tags:
  - game
  - IT
  - jeu-video
  - video_game
date: 2026-06-12
date modified: 2026-04-10
date created: 2026-03-13
title: GMTK game Jam 2025
lastmod: 2026-04-10T08:40:01.574Z
---
## Je Participe À La GMTK Game Jam

***

**TLDR :** lire le titre, mon jeu est ici

<iframe frameborder="0" src="https://itch.io/embed/3773502" width="552" height="167"><a href="https://gand-elf.itch.io/loop-hack">Loop-Hack by gand_elf</a></iframe>

<https://gand-elf.itch.io/loop-hack>

### Explications

Vous l'avez sans doute remarqué (ou vous me connaissez...) j'aime bien le jeu vidéo.\
Et j'aime aussi m'intéresser à comment les jeux sont faits, ce qui les rend bien, etc.

Eh bien pour les mêmes raisons, j'aime bien imaginer des jeux, sauf que jamais, je ne les concrétise, ça prend trop de temps, et je n'ai tout simplement pas les compétences nécessaires, il n'y a qu'à voir la galère pour faire celui-là.

Ducou a l'annonce de la GMTK Game Jam qui je suis tous les ans, je me suis dit : Pourquoi pas ? je suis censé réviser, mais ça ne me prend que quatre jours et je ne vais pas tryhard, juste pour essayer. Voir si j'arrive à concrétiser une idée.

Le Thème, c'est **LOOP** ça tombe bien, j'ai pas mal d'idées de jeux qui tourne autour d'une boucle... Non, je vais rush un jeu pas ouf en quatre jours, et j'aimerais faire quelque chose de bien avec ces idées pas une tech démo pas ouf.

ducou, je suis parti à la recherche d'une idée de jeux.

### Trouver Le Jeu Et Un Motor De Jeu

Ma première idée, c'était de faire un jeu dans le style de Swift playgroud, un jeu de programmation autour d'une boucle.

J'ai ouvert Godot, j'ai posé une zone de texte et essayé de lire ce qu'il y avait dedans et... ça ne marchait pas.

Et instantanément, j'ai fermé Godot et cherché sur internet *Motor de jeu débutant*

Alors, j'ai essayé GDevelop et je n'ai rien compris comme je n'ai pas lu le manuel...\
Donc, je suis passé sur un autre dont je connais plus le nom encore pire, pas de code tout était hyper simplifié et je n'arrivais pas à comprendre comment faire ce que je voulais.

Alors, je suis reparti sur GDevelop et j'ai commencé à réfléchir une autre idée de jeu.

J'ai pas mal joué (dans ma tête, je n'arrivais pas à prototyper quoi que ce soit) avec des courses de voitures un peu dans le style des jeux de course Kirby avec le minimum possible d'exécution et uniquement de la stratégie.

Ça n'a pas marché.

Ducou, j'ai rouvert Godot, regardé des examples de code pour fixer les bugs débiles que j'avais, et je suis reparti sur mon idée principale.

C'était la fin de la première journée du game jam, et j'avais un cercle moche qui tournait.

### Programmer Comme Un Cochon

la journée suivante, j'ai réalisé que

* je n'allai pas programmer en journée puisque je faisais des activités avec ma faille
* j'allais programmer la nuit
* je ne savais pas comment le système de scène marchait sur godot donc je n'allais pas l'utiliser (j'ai fini par le faire, mais j'ai suivi un tutorial).

ma philosophie était :

1. fait qqchose qui *marche*
2. fixe les bug
3. ajoute une fonctionalité
4. fixe les bug
5. repeat a partir de 3

heureusement que j'ai fait comme ca sinon je pense que j'y serais encore, merci a ma grande connaissance (c fo) du development hell, qui m'a fait eviter de tout coder avant les bugs.

A la fin du jour 2, j'avais un *jeu* foncionel, pas de niveau presque pas d'interfaces, et pas d'ennemis, juste la mecaniqe principale (le code)

je me suis donné comme objectif :

* jour 3 projectiles
* jour 4 different niveaux

### Jour 3 Projectiles...

les projectiles c'était facile en fait. j'ai juste suivi un tuto et ca marchait persque (juste un peu de debug)

et grace a ma grande experience das le milieu, j'avais concu le systeme d'ennemis pourque je n'ai qu'a copier coller, changer 3 lignes et j'avais un nouveau pattern d'ennemis.

ducou j'ai fusionné les deux objectifs et j'ai finni le jeu au jour 3

Petit conseil que j'aurais dû suivre : ne jamais reporter l'implémentation de qqchose comme **reset()** a la toute fin... c horrible

Noter bien que le changement de jour se passait vers 14h donc c'est bien la troisième nuit.

d'ailleurs quand j'écris en ce moment, on est toujours au jour 3.

Le jeu est jouable et je pense compréhensible par n'importe qui. En revanche, il est moche donc je pense que je vais passer le temps restant à faire du visuel et audio pour que le jeu soit plus joli.

### Le Jeu

Enfin, on en parle !! qu'est-ce-que-c-quoi-qu'on joue ?

On est un hacker et il faut hacker un serveur et pour ce faire, comme chacun le sait, il faut éviter les attaques du serveur et contrattaquer dès que l'on a l'occasion, pour cela, on va programmer un pattern pour notre virus qui va devoir contrecarrer celui du serveur !!

jouez y, c'est gratuit et ça ne prend pas de temps, et dites-moi ce que vous en pensez, et les points a améliorer.
