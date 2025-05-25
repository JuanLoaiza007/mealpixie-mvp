
import {
	Droplet,
	Flame,
	Drumstick,
	Candy,
	SprayCan,
	Utensils,
	Wheat,
	Egg,
	HeartPulse,
	Info,
} from "lucide-react";

const nutrientIcons = {
	calorías: <Flame className="w-5 h-5 text-orange-500" />,
	energía: <Flame className="w-5 h-5 text-orange-500" />,
	"valor energético": <Flame className="w-5 h-5 text-orange-500" />,
	"energía total": <Flame className="w-5 h-5 text-orange-500" />,
	"calories": <Flame className="w-5 h-5 text-orange-500" />,

	grasas: <Droplet className="w-5 h-5 text-yellow-600" />,
	"grasas totales": <Droplet className="w-5 h-5 text-yellow-600" />,
	"contenido graso": <Droplet className="w-5 h-5 text-yellow-600" />,
	"grasa total": <Droplet className="w-5 h-5 text-yellow-600" />,

	"grasas saturadas": <Droplet className="w-5 h-5 text-yellow-800" />,
	"saturated fat": <Droplet className="w-5 h-5 text-yellow-800" />,
	"grasa saturada": <Droplet className="w-5 h-5 text-yellow-800" />,

	"grasas trans": <Droplet className="w-5 h-5 text-yellow-400" />,
	"trans fat": <Droplet className="w-5 h-5 text-yellow-400" />,

	azúcares: <Candy className="w-5 h-5 text-pink-600" />,
	azúcar: <Candy className="w-5 h-5 text-pink-600" />,
	"azúcar total": <Candy className="w-5 h-5 text-pink-600" />,
	"contenido de azúcar": <Candy className="w-5 h-5 text-pink-600" />,

	proteínas: <Drumstick className="w-5 h-5 text-amber-700" />,
	proteína: <Drumstick className="w-5 h-5 text-amber-700" />,
	"contenido proteico": <Drumstick className="w-5 h-5 text-amber-700" />,
	"proteínas totales": <Drumstick className="w-5 h-5 text-amber-700" />,

	sodio: <SprayCan className="w-5 h-5 text-sky-600" />,
	sal: <SprayCan className="w-5 h-5 text-sky-600" />,
	"contenido de sodio": <SprayCan className="w-5 h-5 text-sky-600" />,

	carbohidratos: <Utensils className="w-5 h-5 text-lime-600" />,
	"carbohidratos totales": <Utensils className="w-5 h-5 text-lime-600" />,
	carbohidrato: <Utensils className="w-5 h-5 text-lime-600" />,
	carbs: <Utensils className="w-5 h-5 text-lime-600" />,

	fibra: <Wheat className="w-5 h-5 text-lime-800" />,
	"fibra dietaria": <Wheat className="w-5 h-5 text-lime-800" />,
	"fibra total": <Wheat className="w-5 h-5 text-lime-800" />,

	colesterol: <HeartPulse className="w-5 h-5 text-red-600" />,

	huevo: <Egg className="w-5 h-5 text-zinc-500" />,

	"vitamina a": <HeartPulse className="w-5 h-5 text-green-600" />,
	"vitamina c": <HeartPulse className="w-5 h-5 text-green-600" />,
	"vitamina d": <HeartPulse className="w-5 h-5 text-green-600" />,
	"vitamina b": <HeartPulse className="w-5 h-5 text-green-600" />,
	"vitaminas": <HeartPulse className="w-5 h-5 text-green-600" />,
	hierro: <HeartPulse className="w-5 h-5 text-green-700" />,
	calcio: <HeartPulse className="w-5 h-5 text-blue-700" />,
	zinc: <HeartPulse className="w-5 h-5 text-purple-600" />,
	potasio: <HeartPulse className="w-5 h-5 text-amber-600" />,
};

/**
 * Returns a corresponding nutrient icon component based on the given field name.
 *
 * @param {string} name — The name of the nutrient field to match (required).
 * @returns {JSX.Element} The JSX icon component representing the nutrient, or a default info icon if no match is found.
 * @example
 * getIconForField("Grasas Totales");
 * // Returns: <Droplet className="w-5 h-5 text-yellow-600" />
 *
 * getIconForField("Vitamin D");
 * // Returns: <HeartPulse className="w-5 h-5 text-green-600" />
 */
export function getIconForField(name) {
	const key = name.toLowerCase().trim();
	for (const nutrient in nutrientIcons) {
		if (key.includes(nutrient)) return nutrientIcons[nutrient];
	}
	return <Info className="w-5 h-5 text-muted-foreground" />;
}