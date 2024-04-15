# MAKE-YOUR-GAME : SATHIE 
## DESIGN
```bash
* Décor : 2 composants
	-> arrière plan
	-> obstacles
		<1e type : la plateforme>
		<2e type : éléments flottants
			? briques ?
			? mystery boxes (contient un "Paka") ?>
		<3e type : walls>
		<4e type : stairs>

* Static elements : Décor & 2 bonus (flowers & coins)

* Mobile elements : 3 components
		-> the Player
		-> the Ennemies

* Movements :
	-> Automatic 
		! se déplace sur les obstacles !
		! s'il rentre en collision avec un obstacle à sa gauche ou à sa droite il change de direction horizontale !
		! s'il arrive au bout d'un obstacle il tombe !
		! disparait s'il passe dans le vide !
	-> Manual
		>> Directions : UP, DOWN, LEFT & RIGHT
		>> Acceleration (dash, jump & gravity)

```
----------------------------------------------------------------------------

## GAMEPLAY

```bash

-> SCORE
    <100 pts : killing an ennemy>
    <200 pts : taking a coin>
    <300 pts : taking a "Paka">
-> Khaliss 
    <1 point : taking a Wetiet>
-> TIME 
    <decreasing time>
-> LIVES 
    <number of lives you have in total>

Movements :
            ! When the user reaches the middle of the screen (the screen moves with the user while he moves to the right, until the end of the stage is reached) !
            ! the screen can't move backward only forward !
            ! if a player touches an ennemy he will lose 1 life and all his khaliss!  
            ! if the player kill an ennemy, the ennemy dissapear !
            ! the player will kill an ennemy only with the "Paka" ! 
            ! the game is over whenever the live number goes below 1 !  
            ! when time is 0 the player will lose 1 life !
```