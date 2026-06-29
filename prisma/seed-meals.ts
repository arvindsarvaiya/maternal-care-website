import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface MealInput {
    name: string;
    mealType: 'BREAKFAST' | 'LUNCH' | 'SNACK' | 'DINNER';
    trimester: 'FIRST' | 'SECOND' | 'THIRD';
    calories: number;
    folate: number;
    iron: number;
    calcium: number;
}

interface MealTranslations {
    [mealName: string]: {
        en: string;
        hi: string;
        bn: string;
        ta: string;
        te: string;
        mr: string;
        gu: string;
    };
}

const vegMeals: MealInput[] = [
    // ─── FIRST TRIMESTER BREAKFAST (20) ───
    { name: "Spinach & Moong Dal Cheela", mealType: "BREAKFAST", trimester: "FIRST", calories: 280, folate: 140, iron: 3.5, calcium: 60 },
    { name: "Ginger Poha with Roasted Peanuts", mealType: "BREAKFAST", trimester: "FIRST", calories: 310, folate: 45, iron: 2.8, calcium: 40 },
    { name: "Oats Upma with Green Peas", mealType: "BREAKFAST", trimester: "FIRST", calories: 290, folate: 55, iron: 2.4, calcium: 50 },
    { name: "Suji Idli with Mint Chutney", mealType: "BREAKFAST", trimester: "FIRST", calories: 260, folate: 40, iron: 1.9, calcium: 45 },
    { name: "Whole Wheat Bread with Mashed Avocado", mealType: "BREAKFAST", trimester: "FIRST", calories: 320, folate: 90, iron: 2.1, calcium: 30 },
    { name: "Missi Roti (Gram Flour) with Curd", mealType: "BREAKFAST", trimester: "FIRST", calories: 340, folate: 65, iron: 3.2, calcium: 180 },
    { name: "Methi Thepla with Raw Mango Pickle", mealType: "BREAKFAST", trimester: "FIRST", calories: 295, folate: 110, iron: 3.6, calcium: 85 },
    { name: "Sattu Porridge with Milk", mealType: "BREAKFAST", trimester: "FIRST", calories: 310, folate: 50, iron: 2.9, calcium: 210 },
    { name: "Daliya Upma with Carrots and Beans", mealType: "BREAKFAST", trimester: "FIRST", calories: 275, folate: 48, iron: 2.2, calcium: 55 },
    { name: "Paneer Toast on Whole Wheat", mealType: "BREAKFAST", trimester: "FIRST", calories: 330, folate: 35, iron: 1.8, calcium: 220 },
    { name: "Sabudana Khichdi with Roasted Peanuts", mealType: "BREAKFAST", trimester: "FIRST", calories: 350, folate: 28, iron: 1.5, calcium: 35 },
    { name: "Moong Dal Sprouts Chaat (Steamed)", mealType: "BREAKFAST", trimester: "FIRST", calories: 240, folate: 160, iron: 4.1, calcium: 65 },
    { name: "Besan Dhokla with Curry Leaves", mealType: "BREAKFAST", trimester: "FIRST", calories: 250, folate: 70, iron: 2.5, calcium: 50 },
    { name: "Barley Dosa with Tomato Onion Chutney", mealType: "BREAKFAST", trimester: "FIRST", calories: 280, folate: 52, iron: 2.7, calcium: 40 },
    { name: "Mixed Vegetable Stuffed Uttapam", mealType: "BREAKFAST", trimester: "FIRST", calories: 310, folate: 60, iron: 2.3, calcium: 70 },
    { name: "Rajgira (Amaranth) Porridge", mealType: "BREAKFAST", trimester: "FIRST", calories: 320, folate: 85, iron: 4.2, calcium: 290 },
    { name: "Vermicelli Upma with Cashews", mealType: "BREAKFAST", trimester: "FIRST", calories: 295, folate: 35, iron: 1.9, calcium: 30 },
    { name: "Makhana Porridge with Almond Milk", mealType: "BREAKFAST", trimester: "FIRST", calories: 280, folate: 42, iron: 2.1, calcium: 190 },
    { name: "Banana Walnut Wheat Pancakes", mealType: "BREAKFAST", trimester: "FIRST", calories: 340, folate: 55, iron: 2.0, calcium: 60 },
    { name: "Flaked Rice (Poha) with Sprouts Mix", mealType: "BREAKFAST", trimester: "FIRST", calories: 305, folate: 95, iron: 3.4, calcium: 55 },

    // ─── FIRST TRIMESTER LUNCH (20) ───
    { name: "Palak Dal with Brown Rice & Curd", mealType: "LUNCH", trimester: "FIRST", calories: 420, folate: 180, iron: 4.2, calcium: 150 },
    { name: "Jeera Aloo, Ajwain Paratha & Raita", mealType: "LUNCH", trimester: "FIRST", calories: 460, folate: 35, iron: 2.5, calcium: 120 },
    { name: "Chana Masala, Roti & Tossed Salad", mealType: "LUNCH", trimester: "FIRST", calories: 440, folate: 125, iron: 4.8, calcium: 90 },
    { name: "Black Eyed Peas (Lobia) Curry with Rice", mealType: "LUNCH", trimester: "FIRST", calories: 430, folate: 140, iron: 4.3, calcium: 95 },
    { name: "Moong Dal Khichdi with Kadhi", mealType: "LUNCH", trimester: "FIRST", calories: 410, folate: 95, iron: 3.6, calcium: 140 },
    { name: "Baingan Bharta, Missi Roti & Onion Raita", mealType: "LUNCH", trimester: "FIRST", calories: 450, folate: 58, iron: 3.1, calcium: 110 },
    { name: "Bhindi Masala, Whole Wheat Roti & Buttermilk", mealType: "LUNCH", trimester: "FIRST", calories: 390, folate: 85, iron: 2.9, calcium: 130 },
    { name: "Aloo Matar Curry, Whole Wheat Poori & Curd", mealType: "LUNCH", trimester: "FIRST", calories: 490, folate: 62, iron: 2.8, calcium: 115 },
    { name: "Torai (Ridge Gourd) Moong Dal, Roti & Salad", mealType: "LUNCH", trimester: "FIRST", calories: 380, folate: 90, iron: 3.2, calcium: 80 },
    { name: "Methi Matar Malai (Low Fat), Roti & Curd", mealType: "LUNCH", trimester: "FIRST", calories: 460, folate: 135, iron: 3.9, calcium: 210 },
    { name: "Masoor Dal Tadka, Jeera Rice & Beetroot Raita", mealType: "LUNCH", trimester: "FIRST", calories: 440, folate: 150, iron: 4.5, calcium: 140 },
    { name: "Gobi Matar Sabzi, Paratha & Plain Yogurt", mealType: "LUNCH", trimester: "FIRST", calories: 435, folate: 78, iron: 2.6, calcium: 125 },
    { name: "Arhar Dal, Lemon Rice & Cabbage Sambharo", mealType: "LUNCH", trimester: "FIRST", calories: 425, folate: 88, iron: 3.0, calcium: 75 },
    { name: "Mixed Vegetable Kurma, Appam & Boondi Raita", mealType: "LUNCH", trimester: "FIRST", calories: 450, folate: 72, iron: 2.4, calcium: 135 },
    { name: "Sambar Rice, Avial & Roasted Papad", mealType: "LUNCH", trimester: "FIRST", calories: 465, folate: 92, iron: 3.1, calcium: 110 },
    { name: "Rajma Bowl with Red Rice & Kachumber", mealType: "LUNCH", trimester: "FIRST", calories: 480, folate: 115, iron: 4.9, calcium: 85 },
    { name: "Sai Bhaji (Sindhi Spinach Dal) with Khichdi", mealType: "LUNCH", trimester: "FIRST", calories: 430, folate: 190, iron: 5.1, calcium: 145 },
    { name: "Kadi Chawal with Steamed Brocolli Side", mealType: "LUNCH", trimester: "FIRST", calories: 440, folate: 65, iron: 2.8, calcium: 120 },
    { name: "Paneer Tikka Roll in Whole Wheat Wrap", mealType: "LUNCH", trimester: "FIRST", calories: 470, folate: 45, iron: 2.5, calcium: 260 },
    { name: "Curd Rice with Pomegranate Seeds & Beans Poriyal", mealType: "LUNCH", trimester: "FIRST", calories: 395, folate: 55, iron: 1.9, calcium: 240 },

    // ─── FIRST TRIMESTER SNACK (20) ───
    { name: "Roasted Makhana & Orange Slice", mealType: "SNACK", trimester: "FIRST", calories: 150, folate: 40, iron: 1.2, calcium: 80 },
    { name: "Vegetable Upma with Lemon Squeeze", mealType: "SNACK", trimester: "FIRST", calories: 180, folate: 30, iron: 1.5, calcium: 30 },
    { name: "Dhokla with Green Chutney", mealType: "SNACK", trimester: "FIRST", calories: 160, folate: 45, iron: 1.4, calcium: 35 },
    { name: "Sweet Corn Chaat with Mint & Lemon", mealType: "SNACK", trimester: "FIRST", calories: 140, folate: 35, iron: 1.1, calcium: 20 },
    { name: "Dry Roasted Chana (Murmura Mix)", mealType: "SNACK", trimester: "FIRST", calories: 130, folate: 50, iron: 2.6, calcium: 45 },
    { name: "Fresh Sweet Lime (Mosambi) Juice & Walnuts", mealType: "SNACK", trimester: "FIRST", calories: 190, folate: 42, iron: 1.3, calcium: 50 },
    { name: "Apple Slices with Dash of Cinnamon", mealType: "SNACK", trimester: "FIRST", calories: 95, folate: 10, iron: 0.5, calcium: 15 },
    { name: "Coconut Water & Steamed Corn Cup", mealType: "SNACK", trimester: "FIRST", calories: 120, folate: 25, iron: 0.9, calcium: 40 },
    { name: "Wheat Khakhra with Homemade Hummus", mealType: "SNACK", trimester: "FIRST", calories: 175, folate: 55, iron: 1.8, calcium: 55 },
    { name: "Plain Yogurt with Honey & Kiwi Dice", mealType: "SNACK", trimester: "FIRST", calories: 165, folate: 38, iron: 0.6, calcium: 190 },
    { name: "Baked Beetroot Chips with Curd Dip", mealType: "SNACK", trimester: "FIRST", calories: 140, folate: 48, iron: 1.9, calcium: 110 },
    { name: "Soaked Almonds & Dried Figs (Anjeer)", mealType: "SNACK", trimester: "FIRST", calories: 210, folate: 22, iron: 2.2, calcium: 95 },
    { name: "Puffed Rice Bhel with Tomato & Coriander", mealType: "SNACK", trimester: "FIRST", calories: 120, folate: 32, iron: 1.4, calcium: 25 },
    { name: "Banana Ginger Smoothie (Dairy Free)", mealType: "SNACK", trimester: "FIRST", calories: 180, folate: 30, iron: 0.9, calcium: 30 },
    { name: "Grated Carrot Halwa (Low Sugar, Milk Base)", mealType: "SNACK", trimester: "FIRST", calories: 195, folate: 18, iron: 1.1, calcium: 130 },
    { name: "Steamed Idli Fries (Air Fried, Podi)", mealType: "SNACK", trimester: "FIRST", calories: 150, folate: 20, iron: 1.0, calcium: 25 },
    { name: "Stir-fried Mushrooms with Black Pepper", mealType: "SNACK", trimester: "FIRST", calories: 110, folate: 28, iron: 1.5, calcium: 20 },
    { name: "Amla Candy & Handful of Roasted Peanuts", mealType: "SNACK", trimester: "FIRST", calories: 185, folate: 25, iron: 1.6, calcium: 45 },
    { name: "Whole Green Gram Soup (Moong Shorba)", mealType: "SNACK", trimester: "FIRST", calories: 130, folate: 85, iron: 2.1, calcium: 40 },
    { name: "Avocado Tomato Salad with Lime Juice", mealType: "SNACK", trimester: "FIRST", calories: 160, folate: 75, iron: 1.1, calcium: 25 },

    // ─── FIRST TRIMESTER DINNER (20) ───
    { name: "Lauki Chana Dal, Roti & Cucumber", mealType: "DINNER", trimester: "FIRST", calories: 380, folate: 90, iron: 3.1, calcium: 70 },
    { name: "Khichdi with Ghee & Tomato Chutney", mealType: "DINNER", trimester: "FIRST", calories: 350, folate: 75, iron: 2.9, calcium: 50 },
    { name: "Turrai Sabzi, Mong Dal Wrap & Buttermilk", mealType: "DINNER", trimester: "FIRST", calories: 370, folate: 82, iron: 3.3, calcium: 140 },
    { name: "Paneer Bhurji Light, Oats Roti & Salad", mealType: "DINNER", trimester: "FIRST", calories: 410, folate: 38, iron: 2.4, calcium: 240 },
    { name: "Jeera Rice with Yellow Moong Dal Tadka", mealType: "DINNER", trimester: "FIRST", calories: 390, folate: 110, iron: 3.5, calcium: 60 },
    { name: "Aloo Methi Dry, Plain Roti & Beetroot Raita", mealType: "DINNER", trimester: "FIRST", calories: 420, folate: 120, iron: 4.1, calcium: 130 },
    { name: "Mixed Veg Pulao with Masala Curd", mealType: "DINNER", trimester: "FIRST", calories: 415, folate: 68, iron: 2.6, calcium: 145 },
    { name: "Sitafal (Pumpkin) Erissery & Brown Rice", mealType: "DINNER", trimester: "FIRST", calories: 395, folate: 50, iron: 2.8, calcium: 80 },
    { name: "Baingan Musallam Light with Wheat Roti", mealType: "DINNER", trimester: "FIRST", calories: 385, folate: 44, iron: 2.1, calcium: 65 },
    { name: "Tinda (Apple Gourd) Sabzi, Phulka & Curd", mealType: "DINNER", trimester: "FIRST", calories: 360, folate: 55, iron: 2.3, calcium: 125 },
    { name: "Matar Paneer Semidry with Whole Wheat Roti", mealType: "DINNER", trimester: "FIRST", calories: 430, folate: 52, iron: 2.9, calcium: 250 },
    { name: "White Pumpkin (Pethra) Kootu & Rice", mealType: "DINNER", trimester: "FIRST", calories: 375, folate: 74, iron: 2.5, calcium: 90 },
    { name: "Parwal (Pointed Gourd) Masala, Roti & Salad", mealType: "DINNER", trimester: "FIRST", calories: 365, folate: 42, iron: 2.0, calcium: 55 },
    { name: "Kadi Khichdi with Roasted Flaxseed Papad", mealType: "DINNER", trimester: "FIRST", calories: 390, folate: 80, iron: 2.8, calcium: 110 },
    { name: "Stuffed Capsicum with Paneer & Wheat Phulka", mealType: "DINNER", trimester: "FIRST", calories: 410, folate: 48, iron: 2.6, calcium: 215 },
    { name: "Mash Moong Dal, Jowar Roti & Radish Salad", mealType: "DINNER", trimester: "FIRST", calories: 425, folate: 115, iron: 3.8, calcium: 95 },
    { name: "Clear Lentil Vegetable Soup with Garlic Bread", mealType: "DINNER", trimester: "FIRST", calories: 340, folate: 95, iron: 3.1, calcium: 70 },
    { name: "Tomato Upma with Green Coriander Mix", mealType: "DINNER", trimester: "FIRST", calories: 320, folate: 54, iron: 1.9, calcium: 45 },
    { name: "Raw Papaya Veg (Safe Prepped Cooked), Phulka", mealType: "DINNER", trimester: "FIRST", calories: 350, folate: 60, iron: 2.1, calcium: 65 },
    { name: "Curd Vermicelli with Grated Cucumber & Carrots", mealType: "DINNER", trimester: "FIRST", calories: 360, folate: 40, iron: 1.5, calcium: 190 },

    // ─── SECOND TRIMESTER BREAKFAST (20) ───
    { name: "Ragi (Finger Millet) Idli with Sambar", mealType: "BREAKFAST", trimester: "SECOND", calories: 310, folate: 50, iron: 3.8, calcium: 320 },
    { name: "Iron-Rich Beetroot Poha + Boiled Milk", mealType: "BREAKFAST", trimester: "SECOND", calories: 340, folate: 60, iron: 4.1, calcium: 240 },
    { name: "Sprouted Moong Paratha with Creamy Curd", mealType: "BREAKFAST", trimester: "SECOND", calories: 360, folate: 130, iron: 4.5, calcium: 160 },
    { name: "Scrambled Tofu Toast with Spinach Base", mealType: "BREAKFAST", trimester: "SECOND", calories: 330, folate: 105, iron: 4.2, calcium: 195 },
    { name: "Ragi Porridge with Almonds & Dates Jaggery", mealType: "BREAKFAST", trimester: "SECOND", calories: 350, folate: 40, iron: 4.6, calcium: 390 },
    { name: "Kuttu (Buckwheat) Cheela with Mint Chutney", mealType: "BREAKFAST", trimester: "SECOND", calories: 320, folate: 75, iron: 3.9, calcium: 70 },
    { name: "Jowar Flakes Poha with Curry Leaves & Peas", mealType: "BREAKFAST", trimester: "SECOND", calories: 295, folate: 45, iron: 3.4, calcium: 65 },
    { name: "Paneer Stuffed Moong Dal Cheela", mealType: "BREAKFAST", trimester: "SECOND", calories: 370, folate: 115, iron: 3.8, calcium: 280 },
    { name: "Bajra Roti with White Butter & Methi Leaf", mealType: "BREAKFAST", trimester: "SECOND", calories: 345, folate: 95, iron: 4.4, calcium: 110 },
    { name: "Oats and Spinach Puri (Baked) with Chana", mealType: "BREAKFAST", trimester: "SECOND", calories: 380, folate: 120, iron: 4.9, calcium: 130 },
    { name: "Amaranth Flour (Rajgira) Cheela", mealType: "BREAKFAST", trimester: "SECOND", calories: 310, folate: 80, iron: 4.0, calcium: 270 },
    { name: "Sesame Ladoo with Milk Glass", mealType: "BREAKFAST", trimester: "SECOND", calories: 365, folate: 35, iron: 5.2, calcium: 410 },
    { name: "Soy Flour Mixed Missi Paratha", mealType: "BREAKFAST", trimester: "SECOND", calories: 350, folate: 72, iron: 4.3, calcium: 140 },
    { name: "Thalipeeth (Multigrain Pancake) with Curd", mealType: "BREAKFAST", trimester: "SECOND", calories: 340, folate: 64, iron: 3.7, calcium: 175 },
    { name: "Quinoa Upma with Peanut Crunch", mealType: "BREAKFAST", trimester: "SECOND", calories: 325, folate: 58, iron: 3.2, calcium: 80 },
    { name: "Mixed Nut Powder Milk with Khakhra", mealType: "BREAKFAST", trimester: "SECOND", calories: 370, folate: 48, iron: 3.6, calcium: 310 },
    { name: "Boiled Black Chana Chat with Amchoor", mealType: "BREAKFAST", trimester: "SECOND", calories: 290, folate: 110, iron: 4.7, calcium: 90 },
    { name: "Millet Pongal with Coconut Chutney", mealType: "BREAKFAST", trimester: "SECOND", calories: 320, folate: 52, iron: 3.1, calcium: 60 },
    { name: "Whole Green Gram Dosa (Pesarattu)", mealType: "BREAKFAST", trimester: "SECOND", calories: 340, folate: 145, iron: 4.0, calcium: 85 },
    { name: "Whole Wheat Daliya with Saffron & Raisins", mealType: "BREAKFAST", trimester: "SECOND", calories: 330, folate: 42, iron: 3.5, calcium: 160 },

    // ─── SECOND TRIMESTER LUNCH (20) ───
    { name: "Chole (Chickpeas), Missi Roti & Salad", mealType: "LUNCH", trimester: "SECOND", calories: 490, folate: 110, iron: 5.2, calcium: 140 },
    { name: "Paneer Bhurji, Oats Roti & Beet Salad", mealType: "LUNCH", trimester: "SECOND", calories: 510, folate: 45, iron: 4.8, calcium: 290 },
    { name: "Rajma Masala with Jowar Roti & Yogurt", mealType: "LUNCH", trimester: "SECOND", calories: 480, folate: 115, iron: 5.1, calcium: 165 },
    { name: "Palak Paneer with Missi Phulka & Lemon Squeeze", mealType: "LUNCH", trimester: "SECOND", calories: 520, folate: 140, iron: 5.5, calcium: 380 },
    { name: "Black Dal (Urad), Bajra Roti & Cucumber Bowl", mealType: "LUNCH", trimester: "SECOND", calories: 495, folate: 95, iron: 4.9, calcium: 160 },
    { name: "Soya Chunks Curry, Whole Wheat Roti & Curd", mealType: "LUNCH", trimester: "SECOND", calories: 515, folate: 80, iron: 5.8, calcium: 210 },
    { name: "Kala Chana Masala, Brown Rice & Spinach Salad", mealType: "LUNCH", trimester: "SECOND", calories: 475, folate: 135, iron: 5.4, calcium: 130 },
    { name: "Methi Kadhi with Amaranth Rice Platter", mealType: "LUNCH", trimester: "SECOND", calories: 460, folate: 110, iron: 4.2, calcium: 240 },
    { name: "Mushroom Matar Tofu Curry with Roti & Salad", mealType: "LUNCH", trimester: "SECOND", calories: 440, folate: 68, iron: 4.0, calcium: 185 },
    { name: "Lobiya (Chawli) Thali with Jowar Roti & Raita", mealType: "LUNCH", trimester: "SECOND", calories: 485, folate: 125, iron: 4.7, calcium: 150 },
    { name: "Drumstick (Sambhar) Curry, Red Rice & Curd", mealType: "LUNCH", trimester: "SECOND", calories: 435, folate: 74, iron: 3.9, calcium: 280 },
    { name: "Gatte Ki Kadhi with Bajra Khichdi Combo", mealType: "LUNCH", trimester: "SECOND", calories: 510, folate: 85, iron: 4.1, calcium: 190 },
    { name: "Stuffed Karela (Bittergourd), Dal & Oats Roti", mealType: "LUNCH", trimester: "SECOND", calories: 450, folate: 90, iron: 4.3, calcium: 115 },
    { name: "Kadhai Paneer (Healthy Prep), Multigrain Roti", mealType: "LUNCH", trimester: "SECOND", calories: 530, folate: 42, iron: 4.6, calcium: 340 },
    { name: "Moong Dal Chilka Sabzi, Phulka & Carrot Raita", mealType: "LUNCH", trimester: "SECOND", calories: 445, folate: 118, iron: 4.2, calcium: 140 },
    { name: "Mixed Sprouts Khichdi with Flaxseed Yogurt", mealType: "LUNCH", trimester: "SECOND", calories: 465, folate: 145, iron: 5.0, calcium: 170 },
    { name: "Broccoli & Bell Pepper Stir-fry Rice with Dal", mealType: "LUNCH", trimester: "SECOND", calories: 450, folate: 92, iron: 3.8, calcium: 120 },
    { name: "Spiced Curd Fenugreek (Methi Chaman) with Roti", mealType: "LUNCH", trimester: "SECOND", calories: 480, folate: 122, iron: 4.5, calcium: 230 },
    { name: "Jackfruit (Kathal) Sabzi, Wheat Phulka & Salad", mealType: "LUNCH", trimester: "SECOND", calories: 430, folate: 55, iron: 3.7, calcium: 95 },
    { name: "Bisi Bele Bath (Millet Base) with Curd Platter", mealType: "LUNCH", trimester: "SECOND", calories: 460, folate: 78, iron: 3.9, calcium: 155 },

    // ─── SECOND TRIMESTER SNACK (20) ───
    { name: "Handful of Almonds, Walnuts & Date", mealType: "SNACK", trimester: "SECOND", calories: 210, folate: 25, iron: 2.1, calcium: 90 },
    { name: "Multi-grain Toast with Peanut Butter", mealType: "SNACK", trimester: "SECOND", calories: 240, folate: 30, iron: 1.8, calcium: 40 },
    { name: "Beetroot Hummus with Cucumber Sticks", mealType: "SNACK", trimester: "SECOND", calories: 160, folate: 65, iron: 2.2, calcium: 55 },
    { name: "Roasted Amaranth Patties (Tikki Style)", mealType: "SNACK", trimester: "SECOND", calories: 180, folate: 45, iron: 2.5, calcium: 130 },
    { name: "Warm Sesame Almond Milk Shake", mealType: "SNACK", trimester: "SECOND", calories: 230, folate: 20, iron: 2.8, calcium: 320 },
    { name: "Steamed Sweet Potato with Lemon & Black Salt", mealType: "SNACK", trimester: "SECOND", calories: 150, folate: 35, iron: 1.9, calcium: 45 },
    { name: "Amla & Mint Green Chutney with Khakhra", mealType: "SNACK", trimester: "SECOND", calories: 140, folate: 40, iron: 2.3, calcium: 60 },
    { name: "Paneer Cubes (Tawa Grilled) with Pudina Chutney", mealType: "SNACK", trimester: "SECOND", calories: 210, folate: 15, iron: 1.4, calcium: 280 },
    { name: "Chia Seed Pudding with Mango Puree", mealType: "SNACK", trimester: "SECOND", calories: 195, folate: 32, iron: 1.8, calcium: 210 },
    { name: "Boiled Kala Chana Chaat with Tomatoes", mealType: "SNACK", trimester: "SECOND", calories: 170, folate: 80, iron: 3.1, calcium: 50 },
    { name: "Pumpkin Seed Trail Mix with Raisins", mealType: "SNACK", trimester: "SECOND", calories: 220, folate: 28, iron: 2.9, calcium: 65 },
    { name: "Fresh Pomegranate Bowl with Mint Dressing", mealType: "SNACK", trimester: "SECOND", calories: 130, folate: 38, iron: 1.5, calcium: 25 },
    { name: "Millet Flakes Chewda (Chivda Mix)", mealType: "SNACK", trimester: "SECOND", calories: 160, folate: 30, iron: 2.1, calcium: 40 },
    { name: "Stir-Fried Tofu Bites with Green Chilies", mealType: "SNACK", trimester: "SECOND", calories: 175, folate: 25, iron: 2.4, calcium: 190 },
    { name: "Dried Apricots and Walnut Halves", mealType: "SNACK", trimester: "SECOND", calories: 205, folate: 18, iron: 2.6, calcium: 70 },
    { name: "Spinach Soup with Whole Wheat Grissini", mealType: "SNACK", trimester: "SECOND", calories: 135, folate: 95, iron: 2.8, calcium: 85 },
    { name: "Ragi Ox-Gourd (Ragi Malt Salty Version)", mealType: "SNACK", trimester: "SECOND", calories: 150, folate: 24, iron: 2.9, calcium: 260 },
    { name: "Guava Slices with Black Salt & Chili Powder", mealType: "SNACK", trimester: "SECOND", calories: 90, folate: 45, iron: 1.1, calcium: 30 },
    { name: "Sattu Drink (Roasted Gram Flour Cold Blend)", mealType: "SNACK", trimester: "SECOND", calories: 180, folate: 42, iron: 2.7, calcium: 75 },
    { name: "Flaxseed Jaggery Chikki Bar", mealType: "SNACK", trimester: "SECOND", calories: 190, folate: 15, iron: 2.4, calcium: 110 },

    // ─── SECOND TRIMESTER DINNER (20) ───
    { name: "Soybean Sabzi, Whole Wheat Roti", mealType: "DINNER", trimester: "SECOND", calories: 410, folate: 70, iron: 4.5, calcium: 110 },
    { name: "Dal Makhani (Low Cream) & Jeera Rice", mealType: "DINNER", trimester: "SECOND", calories: 440, folate: 85, iron: 3.9, calcium: 130 },
    { name: "Palak Khichdi with Garlic Tadka & Raita", mealType: "DINNER", trimester: "SECOND", calories: 420, folate: 160, iron: 4.8, calcium: 160 },
    { name: "Methi Chaman (Tofu variant), Jowar Phulka", mealType: "DINNER", trimester: "SECOND", calories: 435, folate: 115, iron: 4.2, calcium: 190 },
    { name: "Black Eyed Beans Masala, Roti & Salad", mealType: "DINNER", trimester: "SECOND", calories: 415, folate: 120, iron: 4.4, calcium: 105 },
    { name: "Paneer Capsicum Stir-fry with Wheat Roti", mealType: "DINNER", trimester: "SECOND", calories: 460, folate: 35, iron: 3.1, calcium: 290 },
    { name: "Moong Dal Whole Ghugni, Bajra Phulka", mealType: "DINNER", trimester: "SECOND", calories: 430, folate: 130, iron: 4.6, calcium: 115 },
    { name: "Malabar Yam (Suran) Curry, Brown Rice Mix", mealType: "DINNER", trimester: "SECOND", calories: 410, folate: 48, iron: 3.5, calcium: 90 },
    { name: "Green Peas and Mushroom Masala, Roti", mealType: "DINNER", trimester: "SECOND", calories: 395, folate: 65, iron: 3.8, calcium: 85 },
    { name: "Colocasia (Arbi) Fenugreek Gravy, Phulka", mealType: "DINNER", trimester: "SECOND", calories: 410, folate: 72, iron: 3.4, calcium: 110 },
    { name: "Gourd Kofta Curry (Appe Style Base), Oats Roti", mealType: "DINNER", trimester: "SECOND", calories: 425, folate: 58, iron: 3.2, calcium: 140 },
    { name: "Mixed Lentil Mangodi Sabzi, Plain Roti", mealType: "DINNER", trimester: "SECOND", calories: 440, folate: 92, iron: 4.1, calcium: 100 },
    { name: "Spinach Tomato Daliya with Moong Chilka", mealType: "DINNER", trimester: "SECOND", calories: 380, folate: 145, iron: 4.9, calcium: 125 },
    { name: "Cluster Beans (Gawar Phali), Jowar Roti, Yogurt", mealType: "DINNER", trimester: "SECOND", calories: 390, folate: 88, iron: 3.7, calcium: 165 },
    { name: "Paneer Do Pyaza (Low Fat Version), Phulka", mealType: "DINNER", trimester: "SECOND", calories: 470, folate: 32, iron: 2.9, calcium: 280 },
    { name: "Sprouted Fenugreek Veg Platter, Barley Roti", mealType: "DINNER", trimester: "SECOND", calories: 415, folate: 150, iron: 5.1, calcium: 150 },
    { name: "Raw Banana Cutlet Gravy, Multigrain Phulka", mealType: "DINNER", trimester: "SECOND", calories: 430, folate: 62, iron: 3.6, calcium: 110 },
    { name: "Lentil Broccoli Casserole (Indian Herb Blend)", mealType: "DINNER", trimester: "SECOND", calories: 405, folate: 95, iron: 4.0, calcium: 160 },
    { name: "Ridge Gourd Chana Kootu, Brown Rice Thali", mealType: "DINNER", trimester: "SECOND", calories: 420, folate: 102, iron: 3.9, calcium: 135 },
    { name: "Thick Vegetable Stew with Brown Rice", mealType: "DINNER", trimester: "SECOND", calories: 390, folate: 80, iron: 3.2, calcium: 95 },

    // ─── THIRD TRIMESTER BREAKFAST (20) ───
    { name: "Oatmeal with Chia Seeds & Saffron Milk", mealType: "BREAKFAST", trimester: "THIRD", calories: 380, folate: 40, iron: 3.2, calcium: 280 },
    { name: "Stuffed Paneer Paratha & Curd", mealType: "BREAKFAST", trimester: "THIRD", calories: 420, folate: 30, iron: 2.5, calcium: 310 },
    { name: "Ragi Flaxseed Malt with Warm Whole Milk", mealType: "BREAKFAST", trimester: "THIRD", calories: 390, folate: 35, iron: 4.1, calcium: 440 },
    { name: "Dry Fruit Stuffed Besan Cheela", mealType: "BREAKFAST", trimester: "THIRD", calories: 410, folate: 85, iron: 3.9, calcium: 140 },
    { name: "Millet Banana Walnut Pancake with Honey", mealType: "BREAKFAST", trimester: "THIRD", calories: 430, folate: 50, iron: 2.8, calcium: 110 },
    { name: "Thick Almond Butter Wheat Toast Triangles", mealType: "BREAKFAST", trimester: "THIRD", calories: 440, folate: 42, iron: 3.1, calcium: 130 },
    { name: "Ghee Roasted Bread Paneer Upma", mealType: "BREAKFAST", trimester: "THIRD", calories: 415, folate: 32, iron: 2.1, calcium: 260 },
    { name: "Rajgira Amaranth Laddu with Milk Pitcher", mealType: "BREAKFAST", trimester: "THIRD", calories: 425, folate: 64, iron: 4.3, calcium: 420 },
    { name: "Sprouted Chickpea Paratha with Ghee", mealType: "BREAKFAST", trimester: "THIRD", calories: 450, folate: 115, iron: 4.6, calcium: 150 },
    { name: "Avocado & Cheese Grated Paratha Pocket", mealType: "BREAKFAST", trimester: "THIRD", calories: 460, folate: 95, iron: 2.4, calcium: 210 },
    { name: "High-Calorie Khoya Daliya Porridge", mealType: "BREAKFAST", trimester: "THIRD", calories: 465, folate: 38, iron: 3.0, calcium: 340 },
    { name: "Sattu Ladoo Blend with Pistachio Dust", mealType: "BREAKFAST", trimester: "THIRD", calories: 435, folate: 45, iron: 3.4, calcium: 115 },
    { name: "Mixed Seeds Granola with Greek Yogurt", mealType: "BREAKFAST", trimester: "THIRD", calories: 470, folate: 52, iron: 3.6, calcium: 290 },
    { name: "Quinoa Almond Porridge with Sliced Figs", mealType: "BREAKFAST", trimester: "THIRD", calories: 425, folate: 48, iron: 3.3, calcium: 180 },
    { name: "Tofu Scramble Roll with Cheese Shavings", mealType: "BREAKFAST", trimester: "THIRD", calories: 445, folate: 65, iron: 3.8, calcium: 270 },
    { name: "Stuffed Gobi Bajra Paratha with White Makkhan", mealType: "BREAKFAST", trimester: "THIRD", calories: 440, folate: 88, iron: 4.0, calcium: 125 },
    { name: "Saffron Cardamom Oats with Soaked Walnuts", mealType: "BREAKFAST", trimester: "THIRD", calories: 410, folate: 42, iron: 2.9, calcium: 190 },
    { name: "Eggless Savory Bread Omelet (Besan Base with Flax)", mealType: "BREAKFAST", trimester: "THIRD", calories: 405, folate: 72, iron: 3.1, calcium: 95 },
    { name: "Sprouted Whole Moong Dosa with Paneer Stuffed", mealType: "BREAKFAST", trimester: "THIRD", calories: 460, folate: 135, iron: 4.2, calcium: 250 },
    { name: "Barley Wheat Porridge with Raisins & Cashews", mealType: "BREAKFAST", trimester: "THIRD", calories: 420, folate: 40, iron: 3.2, calcium: 170 },

    // ─── THIRD TRIMESTER LUNCH (20) ───
    { name: "Rajma (Kidney Beans), Rice & Avocado", mealType: "LUNCH", trimester: "THIRD", calories: 540, folate: 130, iron: 5.5, calcium: 160 },
    { name: "Heavy Shahi Paneer (Mod Cream), Missi Roti Platter", mealType: "LUNCH", trimester: "THIRD", calories: 590, folate: 45, iron: 4.5, calcium: 390 },
    { name: "Double Dal Tadka, Ghee Rice & Yogurt Pot", mealType: "LUNCH", trimester: "THIRD", calories: 560, folate: 155, iron: 5.1, calcium: 180 },
    { name: "Black Chana Pulao with Extra Thick Cucumber Raita", mealType: "LUNCH", trimester: "THIRD", calories: 550, folate: 120, iron: 5.3, calcium: 210 },
    { name: "Soya Paneer Bhurji Mix with Multigrain Paratha", mealType: "LUNCH", trimester: "THIRD", calories: 580, folate: 65, iron: 5.9, calcium: 320 },
    { name: "Kathal (Jackfruit) Biryani, Thick Curd & Flax Seeds", mealType: "LUNCH", trimester: "THIRD", calories: 535, folate: 58, iron: 3.9, calcium: 165 },
    { name: "White Chickpeas Thali with Whole Wheat Lachha Paratha", mealType: "LUNCH", trimester: "THIRD", calories: 570, folate: 115, iron: 5.0, calcium: 150 },
    { name: "Palak Corn Mushroom Curry, Bajra Roti Platter", mealType: "LUNCH", trimester: "THIRD", calories: 520, folate: 175, iron: 5.4, calcium: 215 },
    { name: "Urad Dal Chilka, Oats Roti, Grated Beet Carrot Salad", mealType: "LUNCH", trimester: "THIRD", calories: 530, folate: 105, iron: 4.8, calcium: 140 },
    { name: "Tofu Broccoli Makhani Gravy with Brown Rice", mealType: "LUNCH", trimester: "THIRD", calories: 540, folate: 95, iron: 4.2, calcium: 240 },
    { name: "Moor Kulambu (Buttermilk Gravy), Amaranth Rice & Beans", mealType: "LUNCH", trimester: "THIRD", calories: 510, folate: 88, iron: 3.7, calcium: 290 },
    { name: "Paneer Methi Malai Thali, Whole Wheat Roti, Salad", mealType: "LUNCH", trimester: "THIRD", calories: 595, folate: 110, iron: 4.4, calcium: 370 },
    { name: "Dal Panchmel, Jowar Baati (Baked with Ghee), Raita", mealType: "LUNCH", trimester: "THIRD", calories: 610, folate: 125, iron: 5.2, calcium: 190 },
    { name: "Mixed Bean Salad Bowl with Tahini Lime Dressing", mealType: "LUNCH", trimester: "THIRD", calories: 525, folate: 140, iron: 5.6, calcium: 170 },
    { name: "Dum Aloo (Cashew Base), Multi-seed Phulka Platter", mealType: "LUNCH", trimester: "THIRD", calories: 565, folate: 48, iron: 3.8, calcium: 135 },
    { name: "Peanut Rice, Vegetable Poriyal & Thick Curd Mix", mealType: "LUNCH", trimester: "THIRD", calories: 540, folate: 62, iron: 3.5, calcium: 230 },
    { name: "Kala Chana Khichdi served with Sesame Papdi & Curd", mealType: "LUNCH", trimester: "THIRD", calories: 535, folate: 130, iron: 5.1, calcium: 185 },
    { name: "Millet Curd Rice Loaded with Cashews & Pomegranate", mealType: "LUNCH", trimester: "THIRD", calories: 515, folate: 50, iron: 2.9, calcium: 310 },
    { name: "Veg Soy Keema Matar Curry with Paratha Thali", mealType: "LUNCH", trimester: "THIRD", calories: 575, folate: 85, iron: 6.1, calcium: 180 },
    { name: "Moong Dal Mughlai Extra Rich, Jeera Rice & Greens", mealType: "LUNCH", trimester: "THIRD", calories: 550, folate: 145, iron: 4.9, calcium: 160 },

    // ─── THIRD TRIMESTER SNACK (20) ───
    { name: "Walnut Halves & Soft Medjool Dates Mix", mealType: "SNACK", trimester: "THIRD", calories: 260, folate: 20, iron: 2.3, calcium: 80 },
    { name: "Greek Yogurt Bowl with Flax seeds & Honey", mealType: "SNACK", trimester: "THIRD", calories: 230, folate: 35, iron: 1.1, calcium: 340 },
    { name: "Peanut Flaxseed Ladoo with Jaggery Base", mealType: "SNACK", trimester: "THIRD", calories: 245, folate: 42, iron: 2.9, calcium: 95 },
    { name: "Avocado Shake Blend with Whole Buffalo Milk", mealType: "SNACK", trimester: "THIRD", calories: 290, folate: 110, iron: 1.5, calcium: 270 },
    { name: "Roasted Cashews and Pumpkin Seeds Combo", mealType: "SNACK", trimester: "THIRD", calories: 270, folate: 32, iron: 3.4, calcium: 75 },
    { name: "Baked Ragi Crackers with Avocado Guacamole", mealType: "SNACK", trimester: "THIRD", calories: 240, folate: 80, iron: 3.2, calcium: 190 },
    { name: "Paneer Corn Cutlets (Pan Seared, 2 Large)", mealType: "SNACK", trimester: "THIRD", calories: 255, folate: 28, iron: 1.9, calcium: 260 },
    { name: "Warm Chia Hemp Seed Golden Haldi Milk", mealType: "SNACK", trimester: "THIRD", calories: 235, folate: 15, iron: 2.2, calcium: 380 },
    { name: "Spiced Almond Butter Dipped Apple Wedges", mealType: "SNACK", trimester: "THIRD", calories: 250, folate: 22, iron: 2.0, calcium: 85 },
    { name: "Steamed Edamame Pods with Black Sea Salt", mealType: "SNACK", trimester: "THIRD", calories: 210, folate: 140, iron: 3.5, calcium: 110 },
    { name: "Makhana Chikki Crunch Bars", mealType: "SNACK", trimester: "THIRD", calories: 225, folate: 18, iron: 1.8, calcium: 120 },
    { name: "Tofu Skewers with Peanut Satay Dipping", mealType: "SNACK", trimester: "THIRD", calories: 240, folate: 34, iron: 2.5, calcium: 180 },
    { name: "Fresh Chikoo Shake with Soaked Almond Flakes", mealType: "SNACK", trimester: "THIRD", calories: 265, folate: 24, iron: 1.4, calcium: 210 },
    { name: "Sesame Seed Sweet Til Patti Slab", mealType: "SNACK", trimester: "THIRD", calories: 230, folate: 12, iron: 4.1, calcium: 360 },
    { name: "Baked Beet Peanut Patties with Coriander Dip", mealType: "SNACK", trimester: "THIRD", calories: 220, folate: 60, iron: 2.8, calcium: 65 },
    { name: "Thick Creamy Tomato Soup with Butter Croutons", mealType: "SNACK", trimester: "THIRD", calories: 215, folate: 30, iron: 1.6, calcium: 110 },
    { name: "Cheese Stuffed Steamed Podi Idli Bites", mealType: "SNACK", trimester: "THIRD", calories: 245, folate: 25, iron: 1.2, calcium: 220 },
    { name: "Stir-fried Paneer Cubes in Olive Oil Blend", mealType: "SNACK", trimester: "THIRD", calories: 275, folate: 10, iron: 1.3, calcium: 310 },
    { name: "Mixed Fruit Cream Bowl (Fresh Malai Base)", mealType: "SNACK", trimester: "THIRD", calories: 280, folate: 45, iron: 1.1, calcium: 160 },
    { name: "Hazelnut Dark Chocolate Square & Walnuts", mealType: "SNACK", trimester: "THIRD", calories: 260, folate: 15, iron: 2.2, calcium: 70 },

    // ─── THIRD TRIMESTER DINNER (20) ───
    { name: "Tofu & Broccoli Stir-Fry with Roti", mealType: "DINNER", trimester: "THIRD", calories: 430, folate: 95, iron: 4.2, calcium: 210 },
    { name: "Paneer Pasanda Healthy Style, Wheat Phulka", mealType: "DINNER", trimester: "THIRD", calories: 490, folate: 35, iron: 3.2, calcium: 310 },
    { name: "Masoor Dal Whole Khichdi with Ghee Topping", mealType: "DINNER", trimester: "THIRD", calories: 460, folate: 140, iron: 4.6, calcium: 120 },
    { name: "Palak Kofta Curry (Baked Base) & Bajra Roti", mealType: "DINNER", trimester: "THIRD", calories: 485, folate: 165, iron: 5.1, calcium: 190 },
    { name: "Soya Mattar Gravy with Whole Wheat Phulka", mealType: "DINNER", trimester: "THIRD", calories: 475, folate: 75, iron: 5.2, calcium: 145 },
    { name: "Kadai Paneer Tofu Mix, Jowar Phulka Platter", mealType: "DINNER", trimester: "THIRD", calories: 510, folate: 50, iron: 4.1, calcium: 280 },
    { name: "Lentil Shepherd's Pie (Indian Potato-Dal Bake)", mealType: "DINNER", trimester: "THIRD", calories: 465, folate: 115, iron: 4.3, calcium: 130 },
    { name: "Moong Chilka Ghee Dal with Oats Flour Phulka", mealType: "DINNER", trimester: "THIRD", calories: 450, folate: 125, iron: 4.2, calcium: 115 },
    { name: "Thick Yam & Spinach Mash with Paratha Triangles", mealType: "DINNER", trimester: "THIRD", calories: 480, folate: 135, iron: 4.5, calcium: 170 },
    { name: "Spiced Chickpea Tikka Wrap in Whole Wheat", mealType: "DINNER", trimester: "THIRD", calories: 495, folate: 110, iron: 4.8, calcium: 125 },
    { name: "Creamy Vegetable Khichdi (Cow Ghee Infused)", mealType: "DINNER", trimester: "THIRD", calories: 470, folate: 85, iron: 3.4, calcium: 150 },
    { name: "Mushroom Almond Gravy with Barley Phulka Mix", mealType: "DINNER", trimester: "THIRD", calories: 460, folate: 68, iron: 3.8, calcium: 110 },
    { name: "Malai Kofta (Healthy Greek Yogurt Base), Roti", mealType: "DINNER", trimester: "THIRD", calories: 520, folate: 44, iron: 3.1, calcium: 260 },
    { name: "French Beans Poriyal Extra Cashews, Rice & Dal", mealType: "DINNER", trimester: "THIRD", calories: 465, folate: 90, iron: 3.7, calcium: 140 },
    { name: "Sweet Potato Paneer Mash with Wheat Phulka", mealType: "DINNER", trimester: "THIRD", calories: 485, folate: 42, iron: 3.3, calcium: 250 },
    { name: "Black Lentil Stew with Multi-seed Roasted Bread", mealType: "DINNER", trimester: "THIRD", calories: 470, folate: 98, iron: 4.4, calcium: 135 },
    { name: "Methi Matar Tofu Rice Skillet Bowl Combo", mealType: "DINNER", trimester: "THIRD", calories: 455, folate: 120, iron: 4.0, calcium: 185 },
    { name: "Rich Pumpkin Soup paired with Paneer Toast", mealType: "DINNER", trimester: "THIRD", calories: 440, folate: 60, iron: 2.9, calcium: 290 },
    { name: "Chana Dal Lauki Gravy Extra thick, Jowar Phulka", mealType: "DINNER", trimester: "THIRD", calories: 450, folate: 105, iron: 4.1, calcium: 110 },
    { name: "Curd Daliya Thick Platter with Tempered Curry Leaves", mealType: "DINNER", trimester: "THIRD", calories: 425, folate: 48, iron: 2.5, calcium: 240 },
];

async function loadTranslations(): Promise<MealTranslations> {
    const translationsPath = path.join(__dirname, 'meal-translations.json');
    const translationsContent = await fs.readFile(translationsPath, 'utf-8');
    const data = JSON.parse(translationsContent);
    return data.meals;
}

async function getLanguageCode(lang: string): Promise<string> {
    const language = await prisma.language.findFirst({
        where: { code: lang }
    });
    if (!language) {
        throw new Error(`Language ${lang} not found in database`);
    }
    return language.id;
}

async function main() {
    console.log(`Seeding ${vegMeals.length} vegetarian meals...`);

    // Load translations
    const translations = await loadTranslations();
    console.log('Loaded meal translations.');

    // Clear existing meals and translations
    await prisma.mealTranslation.deleteMany();
    await prisma.meal.deleteMany();
    console.log('Cleared existing meals and translations.');

    // Get language IDs
    const languageIds: Record<string, string> = {};
    const languages = ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu'];
    for (const lang of languages) {
        languageIds[lang] = await getLanguageCode(lang);
    }
    console.log('Retrieved language IDs.');

    // Batch insert meals with translations
    let inserted = 0;
    for (const meal of vegMeals) {
        const mealTranslations = translations[meal.name];
        
        // Create meal without name (name is now in translations)
        const createdMeal = await prisma.meal.create({
            data: {
                mealType: meal.mealType,
                trimester: meal.trimester,
                calories: meal.calories,
                folate: meal.folate,
                iron: meal.iron,
                calcium: meal.calcium,
                diet: 'veg',
                translations: {
                    create: [
                        {
                            languageId: languageIds.en,
                            name: mealTranslations?.en || meal.name
                        },
                        {
                            languageId: languageIds.hi,
                            name: mealTranslations?.hi || meal.name
                        },
                        {
                            languageId: languageIds.bn,
                            name: mealTranslations?.bn || meal.name
                        },
                        {
                            languageId: languageIds.ta,
                            name: mealTranslations?.ta || meal.name
                        },
                        {
                            languageId: languageIds.te,
                            name: mealTranslations?.te || meal.name
                        },
                        {
                            languageId: languageIds.mr,
                            name: mealTranslations?.mr || meal.name
                        },
                        {
                            languageId: languageIds.gu,
                            name: mealTranslations?.gu || meal.name
                        }
                    ]
                }
            },
        });
        inserted++;
    }

    console.log(`Successfully seeded ${inserted} meals with translations.`);

    // Summary
    const counts = await prisma.meal.groupBy({
        by: ['trimester', 'mealType'],
        _count: true,
    });
    console.log('\nMeal distribution:');
    counts.forEach((c) => {
        console.log(`  ${c.trimester} - ${c.mealType}: ${c._count}`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });