import {
    FoodIcon,
    TransportIcon,
    UtilitiesIcon,
    EntertainmentIcon,
    HealthcareIcon,
    ShoppingIcon,
    EducationIcon,
    OthersCategoryIcon
} from "./Icons";

// Maps each expense category to its icon component, used by the add-expense
// wizard's category picker. Keep keys in sync with CATEGORIES in
// src/data/expenseData.js.
const CATEGORY_ICONS = {
    Food: FoodIcon,
    Transport: TransportIcon,
    Utilities: UtilitiesIcon,
    Entertainment: EntertainmentIcon,
    Healthcare: HealthcareIcon,
    Shopping: ShoppingIcon,
    Education: EducationIcon,
    Others: OthersCategoryIcon
};

export const getCategoryIcon = (category) => CATEGORY_ICONS[category] || OthersCategoryIcon;
