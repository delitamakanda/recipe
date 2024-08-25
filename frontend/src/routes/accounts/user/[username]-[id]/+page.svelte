<script lang="ts">
    import { scale } from 'svelte/transition';
    import { updateField } from '$lib/utils/requestUtils';
    import { nodeBefore } from '$lib/helpers/whiteSpaces';
    import type { User, UserResponse} from '$lib/interfaces/user.interface';
    import { variables } from '$lib/utils/constants';
    export let data : any;
    import { recipeListData } from '$lib/store/recipe';

    const url = `${variables.BASE_API_URL}/user/`;


    let updateResponse: UserResponse;
    let triggerUpdate = async (e: Event) => {
        const sibling = nodeBefore(<HTMLElement>e.target);
        if (sibling) {
            const [res, err] = await updateField(sibling.name, sibling.value, url);
            if (err.length <= 0) {
                updateResponse = res as UserResponse;
            }
        }
    }
    let currentUserData: User;
    $: data.response,
    (() => {
        currentUserData = data.response;
        if (updateResponse && updateResponse.user) {
            currentUserData = updateResponse.user;
        }
    })();


    const addRecipe = async () => {
        // Send recipe to the server

    }
</script>
<svelte:head>
    <title>Dashboard</title>
</svelte:head>

<section class="container" transition:scale|local={{ start: 0.7, duration: 500, delay: 500 }}>
    {#if currentUserData?.id}
    <h1>{currentUserData?.username} profile</h1>
    {/if}
    
    <div class="user-details" transition:scale|local={{ start: 0.2 }}>
        <div class="text-input">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" value={currentUserData?.username}/>
            <button on:click={(e) => triggerUpdate(e)}>Update</button>
        </div>
    </div>
    <div class="user-details" transition:scale|local={{ start: 0.3 }}>
        <div class="text-input">
            <label for="email">Email:</label>
            <input type="text" id="email" name="email" value={currentUserData?.email} />
            <button on:click={(e) => triggerUpdate(e)}>Update</button>
        </div>
    </div>
    <hr />
    <h2>Your Recipes:</h2>
    {#each $recipeListData as recipe}
    <h3>{recipe.title}</h3>
    <p>Ingredients: {recipe.ingredients}</p>
    {/each}

    <hr />
    <div class="recipe-form" transition:scale|local={{ start: 0.4 }}>
        <h2>Add a new recipe:</h2>
        <div class="text-input">
        <input type="text" id="recipe-title" placeholder="Recipe Title" />
        </div>
        <div class="text-input">
        <textarea id="recipe-ingredients" placeholder="Recipe Ingredients" rows="10" style="width: 100%;"></textarea>
        </div>
        <div class="text-input">
        <textarea id="recipe-instructions" placeholder="Recipe Instructions" rows="10" style="width: 100%;"></textarea>
        </div>
        <div class="text-input">
        <input type="text" id="recipe-prep-time" placeholder="Prep Time (in minutes)" />
        </div>
        <div class="text-input">
            <input type="text" id="recipe-cook-time" placeholder="Cook Time (in minutes)" />
        </div>
        <div class="text-input">
            <input type="text" id="recipe-servings" placeholder="Servings" />
        </div>
        <button on:click={addRecipe}>Add Recipe</button>
    </div>
</section>