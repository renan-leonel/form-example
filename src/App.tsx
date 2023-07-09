import { useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { PlusCircle, XCircle } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createUserSchema = z.object({
	name: z
		.string()
		.nonempty({
			message: "O nome é obrigatório",
		})
		.transform((name) => {
			return name
				.toLocaleLowerCase()
				.trim()
				.split(" ")
				.map((word) =>
					word[0].toLocaleUpperCase().concat(word.substring(1))
				)
				.join(" ");
		}),
	email: z
		.string()
		.nonempty({
			message: "O e-mail é obrigatório",
		})
		.email({
			message: "Formato de e-mail inválido",
		})
		.toLowerCase(),
	password: z
		.string()
		.nonempty({
			message: "A senha é obrigatória",
		})
		.min(6, {
			message: "A senha precisa ter no mínimo 6 caracteres",
		}),
	techs: z
		.array(
			z.object({
				title: z.string().nonempty({
					message: "O nome da tecnologia é obrigatório",
				}),
			})
		)
		.min(1, {
			message: "Pelo menos 1 tecnologia devem ser informada.",
		}),
});

type CreateUserData = z.infer<typeof createUserSchema>;

export function App() {
	const [output, setOutput] = useState("");

	const createUserForm = useForm<CreateUserData>({
		resolver: zodResolver(createUserSchema),
	});

	async function createUser(data: CreateUserData) {
		setOutput(JSON.stringify(data, null, 2));
	}

	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
		watch,
		control,
	} = createUserForm;

	const userPassword = watch("password");
	const isPasswordStrong = new RegExp(
		"(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
	).test(userPassword);

	const { fields, append, remove } = useFieldArray({
		control,
		name: "techs",
	});

	function addNewTech() {
		append({ title: "" });
	}

	return (
		<main className="h-screen flex flex-row gap-6 items-center justify-center">
			<form
				onSubmit={handleSubmit(createUser)}
				className="flex flex-col gap-4 w-full max-w-xs"
			>
				<div className="flex flex-col gap-1">
					<label
						className="text-sm text-zinc-600 flex items-center justify-between"
						htmlFor="name"
					>
						Nome
					</label>
					<input
						type="name"
						id="name"
						className="flex-1 rounded border border-zinc-300 shadow-sm px-3 py-2 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
						{...register("name")}
					/>
					{errors.name && <span>{errors.name.message}</span>}
				</div>

				<div className="flex flex-col gap-1">
					<label
						className="text-sm text-zinc-600 flex items-center justify-between"
						htmlFor="email"
					>
						E-mail
					</label>
					<input
						type="email"
						id="email"
						className="flex-1 rounded border border-zinc-300 shadow-sm px-3 py-2 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
						{...register("email")}
					/>
					{errors.email && <span>{errors.email.message}</span>}
				</div>

				<div className="flex flex-col gap-1">
					<label
						className="text-sm text-zinc-600 flex items-center justify-between"
						htmlFor="password"
					>
						Senha
						{isPasswordStrong ? (
							<span className="text-xs text-emerald-600">
								Senha forte
							</span>
						) : (
							<span className="text-xs text-red-500">
								Senha fraca
							</span>
						)}
					</label>

					<input
						id="password"
						type="password"
						className="flex-1 rounded border border-zinc-300 shadow-sm px-3 py-2 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
						{...register("password")}
					/>

					{errors.password && <span>{errors.password.message}</span>}
				</div>

				<div className="flex flex-col gap-1">
					<label className="text-sm text-zinc-600 flex items-center justify-between">
						Tecnologias
						<button
							type="button"
							onClick={addNewTech}
							className="text-emerald-500 font-semibold text-xs flex items-center gap-1"
						>
							Adicionar nova
							<PlusCircle size={14} />
						</button>
					</label>
					{errors.techs && <span>{errors.techs.message}</span>}

					{fields.map((field, index) => {
						const fieldName = `techs.${index}.title`;

						return (
							<div
								className="flex flex-col gap-1"
								key={field.id}
							>
								<div className="flex gap-2 items-center">
									<input
										type={"text"}
										{...register(`techs.${index}.title`)}
										className="flex-1 rounded border border-zinc-300 shadow-sm px-3 py-2 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
									/>
									<button
										type="button"
										onClick={() => remove(index)}
										className="text-red-500"
									>
										<XCircle size={14} />
									</button>
								</div>
								{errors.techs?.[index]?.title && (
									<span>
										{errors.techs?.[index]?.title?.message}
									</span>
								)}
							</div>
						);
					})}
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className="bg-violet-500 text-white rounded px-3 h-10 font-semibold text-sm hover:bg-violet-600"
				>
					Salvar
				</button>
			</form>

			{output && (
				<pre className="text-sm bg-zinc-800 text-zinc-100 p-6 rounded-lg">
					{output}
				</pre>
			)}
		</main>
	);
}
