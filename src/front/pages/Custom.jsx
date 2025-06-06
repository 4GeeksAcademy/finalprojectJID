import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const handleFetch = (setIngredients) => {
    fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list")
        .then((res) => res.json())
        .then((data) => {
            if (data.drinks) {
                setIngredients(data.drinks.map((drink) => drink.strIngredient1));
            } else {
                setIngredients([]);
            }
        })
        .catch((err) => console.error(err));
};

const generateCocktailName = () => {
    const adjectives = ["Zesty", "Smooth", "Fiery", "Refreshing", "Bold", "Exotic", "Mystic", "Golden"];
    const nouns = ["Sunset", "Storm", "Delight", "Twist", "Fusion", "Bliss", "Sensation", "Elixir"];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdjective} ${randomNoun}`;
};

export const Custom = () => {
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [cocktailCreated, setCocktailCreated] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        handleFetch(setIngredients);
    }, []);

    const handleIngredientToggle = (ingredient) => {
        const newSelected = selectedIngredients.includes(ingredient)
            ? selectedIngredients.filter((ing) => ing !== ingredient)
            : [...selectedIngredients, ingredient];

        setSelectedIngredients(newSelected);
    };

    const createCocktail = () => {
        if (selectedIngredients.length === 0) {
            alert("Please select at least one ingredient to create a cocktail!");
            return;
        }

        setCocktailCreated({
            name: generateCocktailName(),
            ingredients: selectedIngredients,
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/logout");
    };

    return (
        <div className="custom-app" style={{
            minHeight: "100vh",
            background: "linear-gradient(to right, #ffe0f1, #e0f7ff)",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            paddingBottom: "60px"
        }}>
            {/* Button & Results Container */}
            <div className="button-results-container">
                <div className="button-container">
                    {/* <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button> */}
                    <button className="create-cocktail-btn" onClick={createCocktail}>
                        Create Cocktail
                    </button>
                </div>

                {/* Display created cocktail */}
                {cocktailCreated && (
                    <div className="results-container">
                        <h2 className="cocktail-name">{cocktailCreated.name}</h2>
                        <div className="ingredients-section">
                            <p className="ingredients-title">Ingredients:</p>
                            <ul className="created-ingredients-list">
                                {cocktailCreated.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            <h1 className="glow-black-title">Ingredients List</h1>

            <div className="custom-ingredient-list">
                {ingredients.length > 0 ? (
                    ingredients.map((ingredient) => (
                        <div key={ingredient} className="ingredient-card">
                            <h2>{ingredient}</h2>
                            <img
                                src={`https://www.thecocktaildb.com/images/ingredients/${ingredient}-Medium.png`}
                                alt={ingredient}
                            />
                            <div className="ingredient-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedIngredients.includes(ingredient)}
                                    onChange={() => handleIngredientToggle(ingredient)}
                                />
                                <label>Select Ingredient</label>
                            </div>
                        </div>
                    ))
                ) : (
                    "No Ingredients available!!!"
                )}
            </div>
        </div>
    );
};
