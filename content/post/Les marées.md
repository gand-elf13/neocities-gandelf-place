---
tags:
  - maths
  - oral
  - physics
date: 2026-06-12
date modified: 2026-04-10
date created: 2026-03-13
title: Les marées
lastmod: 2026-04-10T08:40:01.446Z
---
## Introduction.

Voici mon texte pour l’épreuve du grand oral du baccalauréat, je ne suis pas passé dessus mais tout de même, le voici. Le sujet est grandement simplifié pour tenir le temps de 10 minutes de présentation et le rendre compréhensible pour n'importe quel examinateur. Hugo (le logiciel que j'utilise pour ce site web) ne semble pas prendre en charge le LaTeX, bah tant pis, je verrai plus tard.

***

Les marées ont depuis toujours été un mystère pour l'homme. Aristote pensait qu'elles étaient le fruit du resserrement des côtes, le battement du cœur de la terre. Mais grâce aux avancées scientifiques, nous savons aujourd'hui précisément leur cause et comment les prédire, heureusement d'ailleurs, car c'est une information essentielle pour la navigation.

Je vais tout d’abord vous expliquer le **modèle de statique des marées** de **Newton**, puis on verra en quoi ce modèle échoue à décrire les marées réelles et pourquoi on a besoin d’un **modèle dynamique** plus moderne. Enfin, comment fonctionnent les modèles de prédictions aujourd’hui.

***

## 1. Le Principe Du Modèle

L'explication usuellement donnée pour expliquer les marées est la suivante : la lune attire l'eau sur la terre qui s'élève donc à son passage. Cependant, cette explication est fausse. Si l'attraction de la lune sur les particules d'eau était assez forte pour les soulever, les gouttes d'eau seraient sur la lune et non pas sur la terre.

Newton explique les marées par le fait que l'attraction de la lune n'est pas la même partout sur la terre.

En effet,

le champ de gravité de la lune n'est pas constant, que ce soit dans sa force

La force gravitationnelle entre deux corps est donnée par la formule :

<div>
$$
F = G \cdot \frac{M_1 M_2}{r^2}
$$
</div>

où :

* $G$ est la constante gravitationnelle : $6{,}674 \times 10^{-11} \, \text{Nm}^2/\text{kg}^2$
* $M_1$ et $M_2$ sont les masses des deux corps
* $r$ est la distance entre eux

mais aussi dans son orientation. Si on considère que la lune est à l'équateur, les forces aux pôles ne sont pas parallèles mais orientées vers la lune.

***

## 2. Un Calcul Illustratif

Puisque la surface de la terre est plus proche ou plus éloignée de la lune que le centre, les forces exercées par la lune sur la terre ne sont pas égales partout.

La **différence** de force est ce qui crée la marée :

<div>
$$
\Delta F \approx F_S - F_C
$$
</div>

On obtient par le calcul :

<div>
$$
\Delta F\approx 1{,}1 \times 10^{-6} \, \text{m/s}^2
$$
</div>

Ce que ce phénomène va faire selon Newton, c'est modifier la forme de la terre qui deviendra une sorte de ballon de rugby.

***

## 3. Pourquoi Le Modèle De Newton Est Appelé "statique"

Il est dit **statique** car il suppose :

* Que la Terre est **entièrement recouverte d’un océan uniforme**
* Que la Terre ne tourne pas
* Que l’eau s’ajuste **immédiatement** à l’équilibre gravitationnel
* Pas de continents, pas de profondeur variable

Donc ce modèle **ne prend pas en compte les movements réels de l’eau**, ni la dynamique de la Terre en rotation.

***

## 4. Les Limites Du Modèle Statique

Ce modèle **échoue** à décrire les marées réelles, car :

* **Il prédit deux marées hautes par jour**, ce qui est souvent vrai, mais pas toujours.
* **Il ne tient pas compte de la rotation de la Terre**, qui modifie l’orientation du bourrelet de marée.
* **Il suppose un équilibre instantané**, alors que l’eau met du temps à se déplacer.
* Il **ne prévoit pas les effets de résonance**, de canaux ou de côtes qui peuvent amplifier les marées.
* Dans certains endroits (comme le **golfe du Saint-Laurent ou la Méditerranée**), les marées sont très faibles ou très différentes du modèle.

***

## 5. Le Modèle Dynamique : Une Version plus Réaliste

Ainsi, si on place dans le référentiel terrestre, c'est-à-dire que l'on prend le centre de la terre comme point de référence, on voit que les forces de marées seront dirigées vers le centre de la terre aux pôles et vers la lune côté lune, et à l'inverse à l’opposé de la lune. Mais surtout, entre ces deux extrêmes, les forces sont tangentes à la terre.

La raison pour laquelle une différence de force si faible a un effet aussi important que les marées, c'est parce qu'au lieu de s'appliquer verticalement, elle s'applique horizontalement et crée une vague.

Le **modèle dynamique des marées**, développé plus tard (notamment par **Laplace**), prend en compte :

* La **rotation de la Terre** → effet de Coriolis
* La **profondeur des océans** → propagation d’ondes
* La **présence des continents**
* Le **temps de réponse des masses d’eau**

Dans ce modèle, les marées sont des **ondes qui se propagent** dans les océans, influencées par les fonds marins, les côtes, les résonances, etc. Il est beaucoup plus précis et permet de calculer les marées locales avec des modèles numériques.

***

## **La Transformée De Fourier Et L'application pratique**

### 1. **Introduction**

On a vu que les forces affectant les marées sont en fait bien plus nombreuses et complexes que ce que Newton imaginait. Heureusement, chacune de ces forces qui entrent en jeu peut être représentée par une function sinusoïdale qui donne la manière dont elles affectent la hauteur de la mer à un point donné en function du temps. Il faut donc trouver ces functions et faire leur some afin d'obtenir une prédiction de marée précise. C'est justement ce à quoi sert la transformée de Fourier.

***

### 2. **Qu’est-ce Que La Transformée De Fourier ?**

* La transformée de Fourier est un outil mathématique qui permet de **décomposer un signal complexe** (comme une courbe) en **ondes sinusoïdales simples**.

* Chaque signal peut être vu comme une some de **sinusoïdes** (ondes en forme de vagues régulières), avec des fréquences et amplitudes différentes.

***

## Application Au Calcul Des Marées

Le niveau de la mer varie à cause de nombreux effets gravitationnels, principalement :

* La Lune (effet principal)
* Le Soleil
* La forme des côtes et fonds marins

Ces effets génèrent des **oscillations régulières** dans le niveau de la mer, à des fréquences précises. Par example :

* **Marée semi-diurne** : variation toutes les **12h 25 min**
* **Marée diurne** : variation toutes les **24h 50 min**

### Forme Mathématique Explicite De La Composante M₂

Chaque composante comme **M₂** est modélisée par une function cosinus :

<div>
$$
h_{M_2}(t) = A_{M_2} \cdot \cos(\omega_{M_2} t + \phi_{M_2})
$$
</div>

* $A_{M_2}$ : l’**amplitude** de la marée M₂ (en mètres)
* $\omega_{M_2}$ : la **fréquence angulaire**, donnée par :

<div>
$$
\omega_{M_2} = \frac{2 \pi}{T_{M_2}} \quad \text{où } T_{M_2} \approx 12{,}42 \, \text{heures, c'est la durée de l'oscillation}
$$
</div>

* $\phi_{M_2}$ : la **phase initiale**, qui dépend du moment où l’on commence à mesurer
* $t$ : le **temps** (en heures ou secondes)

Ainsi, la marée M₂ oscille **deux fois par jour lunaire**, avec une régularité quasi parfaite.

## Superposition De Composantes : Le Modèle Global

Cela permet de **modéliser** les marées avec une grande précision. Une fois qu’on connaît les composantes dominantes, on peut prédire l’évolution du niveau de la mer, en modélisant sa hauteur par la some de toutes les composantes en function du temps :

<div>
$$
h(t) = \sum_{n=1}^{N} A_n \cdot \cos(\omega_n t + \phi_n)
$$
</div>

* $A_n$ : amplitude de la composante
* $\omega_n$ : fréquence
* $\phi_n$ : phase
* $h(t)$ : hauteur de la marée au temps $t$

Pour conclure, nous avons vu comment est-ce que Newton expliquait les marées, mais aussi comment est-ce que son modèle, bien que juste, ne pouvait pas donner de résultats précis et échouait donc à prédire les marées. Ensuite, que la quantité de facteurs entrant en jeu dans les marées rendait toute prédiction basée uniquement sur des données instantanées (phase de la lune, schéma des côtes) impossible ou presque impossible. Et enfin, comment est-ce que les modèles récents contournent ce problème en utilisant des enregistrements du niveau de la mer sur de longues périodes et la transformée de Fourier afin de prédire avec précision les marées à venir.
