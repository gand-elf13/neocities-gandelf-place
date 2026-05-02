---
tags:
  - maths
  - physics
date: 2025-06-12
date modified: 2026-04-26
date created: 2026-03-13
title: Se repérer sur terre grace aux étoiles
lastmod: 2026-04-26T09:41:37.586Z
---
## Intro

Ceci est mon deuxième sujet de grand oral, celui sur lequel je suis passé. Là encore pas de LaTeX jusqu’à nouvel ordre et sujet très simplifié, bonne lecture.

***

## Déterminer Sa Position Grâce Aux Étoiles

Bonjour, je vais vous expliquer les bases de la navigation astronomique, c'est-à-dire comment se repérer sur Terre grâce aux étoiles.

On verra tout d'abord avec l'exemple de l'étoile polaire quelles sont les information que l'on peut obtenir en observant une étoile.

Ensuite, comment à l'aide de plusieurs étoiles on peut déterminer très précisément sa position.

Enfin, comment est-ce que, en pratique, on peut utiliser les étoiles pour se situer.

## I/ L'étoile Polaire

L'une des étoiles les plus remarquables du ciel est l'étoile polaire. En effet, cette étoile est presque située au Nord céleste.

Cette particularité la rend très pratique pour expliquer la navigation astrale. Comme l'étoile est un object situé à l'infini, et bien plus grand que la Terre, ses rayons nous parviennent parallèles.

Si on représente la Terre par un cercle, on peut représenter les rayons venant de l'étoile polaire par des droites parallèles à l'axe de rotation de la Terre.

Ensuite, en considérant que l'on se trouve en un point D, la partie visible du ciel est celle au-dessus de l'horizon que l'on peut représenter par la tangente au cercle au point D.

![polaire](/ob/images/polaire.png)

Un sextant permet de mesurer l'angle entre l'horizon et un object situé dans le ciel. Cela correspond à l'angle $\beta$.\
On observe que :\
$\beta+\gamma+90°=180°\Leftrightarrow \beta+\gamma=90°$

De plus, $\alpha$ correspond à la latitude, et\
$\alpha  + \delta = 90°$

D'après les angles alternes internes,\
$\gamma = \delta$

Soit :\
$\beta - 90° = \alpha - 90° \Leftrightarrow \beta = \alpha$

Or $\alpha$ est l'angle entre l'équateur et notre position, soit notre latitude.

Donc, en mesurant à l'aide d'un sextant l'angle entre l'horizon et l'étoile polaire, on measure en fait notre latitude.

## II/ Que Peut-on En Déduire ?

Une latitude est un cercle sur la surface du globe, qui est repéré par un angle avec l'axe de la Terre.

Ce que l’étoile polaire nous montre, c'est que voir une étoile à un angle donné permet de tracer un seul cercle sur la surface du globe sur lequel l'observateur se trouve.

On va tout d'abord ignorer le fait que la Terre est une sphère et considérer que l'on peut tracer ce cercle sur une mappemonde.

Pour trouver une position précise, un seul cercle, qui est une infinité de points, ne suffit pas. Il faut plus d'informations, par example un deuxième cercle limiterait les possibilités à deux, et un troisième permettrait de savoir exactement où nous sommes.

Le problème, c'est qu'il n'y a pas d'autres cercles déjà définis comme la latitude. Pour trouver les prochains, il va falloir les définir nous-mêmes, c'est-à-dire trouver pour chacun le centre du cercle et son rayon, et pour cela, on va utiliser plus d'étoiles.

## III/ Un Sextant Measure En Fait Une Distance.

Le point B, qui était auparavant le pôle Nord, est généralisé. C'est en fait le pied de l'astre qui est confondu avec le pôle Nord dans le cas de l'étoile polaire, mais bien distinct pour les autres, puisque c'est le projeté orthogonal du centre de l'étoile sur la surface terrestre.

En effet, en reprenant un schéma similaire à celui de l'étoile polaire, on se rend compte que comme ces deux angles sont égaux, alors celui-ci est égal à 90 degrés moins l'angle mesuré par le sextant.

On obtient donc l'écart angulaire entre notre position et le pied de l'astre.

Mais une measure en degrés n'est pas une distance ?

Eh bien, si, c'est comme cela que sont définis les miles nautiques, l'unité de measure de distance utilisée en navigation. Un mile nautique correspond à la distance à la surface de la Terre parcourue en une minute d'angle.

Soit se déplacer d'un degré à la surface de la Terre correspond à parcourir une distance de 60 miles nautiques.

![polaire](/ob/images/polaire.png)

## IV/ Trouver Le Pied De L'astre

Trouver un centre pour notre cercle est relativement facile.

On va choisir une étoile et prendre son pied, soit le projeté orthogonal de l'astre sur la Terre.

En effet, ces positions sont connues, même si elles variant. Des tables appelées les éphémérides nous donnent leurs coordonnées à chaque heure de la journée.

La latitude d'un astre est appelée Angle Horaire et sa longitude Déclinaison.

## V/ Un Problème

Cela fonctionne très bien... en théorie. En effet, la Terre n'est pas plate et tracer des cercles dessus n'est pas si facile. De plus, pour une application pratique, aucune carte n'est à la fois précise et capable de montrer à la fois notre position et celle du pied d'un astre situé la plupart du temps à des milliers de kilomètres.

Pour résoudre ce problème, Marc-Saint-Hilaire a eu cette idée :

Sur une carte de faible échelle, le cercle obtenu par une étoile est indistinguable d'une droite.

On connaît notre distance au pied, et on peut calculer la distance entre le pied et n'importe quel point sur la carte à l'aide de cette formule :

<div>
$$
Dc=\arcsin (\sin(D)\sin(L)+\cos(D)\cos(AH+G)\cos(L))
$$
</div>

Avec, pour rappel :

* $L$ La latitude du point

* $G$ La longitude du point

* $AH$ L'angle horaire

* $D$ La déclinaison de l'astre donnée par une éphéméride.

En faisant la différence entre ces deux distances, on peut savoir à quelle distance de n'importe quel point se trouve le cercle que l'on cherche.

Et donc, on a un point et une distance, ça veut dire qu’on peut tracer un nouveau cercle.

Et ce cercle aura un seul point en commun avec le cercle sur lequel on se trouve.

Cette fois, bien sûr, notre carte, puisque le point peut être n'importe où et donc très proche de nous si on a une vague idée de là où on se trouve, et être certains que nous nous trouvons sur l'une des tangentes de ce cercle.

Il faut maintenant trouver laquelle, et là encore c'est plutôt facile, puisque à cette échelle, le pied est si loin que, que l’on soit sur le point choisi ou à notre vraie position, on verra l’étoile dans la même direction.

On peut simplement mesurer l'azimut de l'étoile à l'aide d'un compas de relèvement, qui est une boussole permettant de viser un object facilement.

Et à l'aide de cette direction, on peut simplement tracer la droite ayant cet azimut sur notre carte pour savoir quelle tangente est la bonne.

Cette direction, appelée azimut, peut être mesurée à l'aide d'un compas de relèvement ou être calculée. Les calculus étant hors programme, on considérera que l'on a obtenu des valeurs précises par la measure.

Voici la formule au besoin :

<div>
$$
\frac{\arccos(\sin(D)-\sin(L)\sin(Dc))}{\cos(L)\cos(Dc)}
$$
</div>

## VI/ Utiliser Les Information Dont on Dispose Pour Déterminer Notre Position.

Pour récapituler, voici comment opérer pour faire le point étoile, c'est-à-dire se localiser grâce aux étoiles :

* Il faut choisir un point de calcul, $Pc$, aux coordonnées pratiques et proche de là où on pense être.

* L'azimut de l'astre mesuré.

* L'intercept $Int$, distance entre notre point de calcul et le cercle correspondent à l'astre observé, qui se calcule :\
  $Int = |Dc - Dz|$

Tout d'abord, on place notre point de calcul $P_c$ sur la carte.

On peut ensuite utiliser une règle Cras (une règle transparente avec un rapporteur dedans) pour tracer une droite d'azimut passant par ce point.

On peut tracer une droite perpendiculaire à la précédente, appelée droite de hauteur. À une distance $Int$ de $Pc$, cette droite est la représentation du cercle sur notre carte.

Il faut maintenant répéter l'opération pour une autre étoile afin d'obtenir une deuxième droite. On n'a pas besoin d'en utiliser une troisième, car notre carte n'est pas assez grande pour montrer les deux intersections.

## VII/ Conclusion

On a donc vu comment est-ce que la position particulière dans le ciel de l’étoile polaire fait que son angle avec l’horizon est égal à la latitude de l’observateur.

Et comment observer trois étoiles à un angle donné définit une seule position sur Terre.

Enfin, comment est-ce que, en pratique, on peut obtenir cette position sur une carte.
