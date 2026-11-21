<?php

namespace App\Http\Requests;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGroupRequest extends FormRequest
{
    /** Límite de integrantes del plan gratuito (Colabo Plus permite hasta 50). */
    public const FREE_MEMBER_LIMIT = 10;

    public const CATEGORIES = [
        'Amigos',
        'Familia',
        'Pareja',
        'Viajes',
        'Eventos y salidas',
        'Estudios',
        'Proyectos',
        'Convivencia',
        'Otros',
    ];

    public const AVATAR_PRESETS = [
        'groups',
        'events',
        'tasks',
        'expenses',
        'agreements',
        'home',
        'globe',
        'equipment',
    ];

    public const CURRENCIES = ['ARS', 'USD', 'EUR', 'BRL', 'CLP', 'UYU', 'MXN', 'COP'];

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Etapa 1: identidad
            'name' => ['required', 'string', 'max:80'],
            'description' => ['nullable', 'string', 'max:500'],
            'category' => ['required', 'string', Rule::in(self::CATEGORIES)],
            'color' => ['required', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'avatar_preset' => ['required', 'string', Rule::in(self::AVATAR_PRESETS)],

            // Etapa 2: integrantes y administración
            'member_limit' => ['required', 'integer', 'min:2', 'max:'.self::FREE_MEMBER_LIMIT],
            'members_can_invite' => ['required', 'boolean'],
            'members_can_create_tasks' => ['required', 'boolean'],
            'members_can_add_expenses' => ['required', 'boolean'],
            'invite_code' => ['nullable', 'string', 'alpha_num', 'size:12', 'unique:invitations,code'],
            'invitees' => [
                'nullable',
                'array',
                'max:'.(self::FREE_MEMBER_LIMIT - 1),
                function (string $attribute, mixed $value, Closure $fail) {
                    $limit = $this->integer('member_limit');

                    if (is_array($value) && count($value) + 1 > $limit) {
                        $fail('Con un límite de '.$limit.' integrantes puedes invitar hasta '.($limit - 1).' personas.');
                    }
                },
            ],
            'invitees.*' => ['required', 'string', 'min:2', 'max:255', 'distinct:ignore_case'],

            // Etapa 3: organización inicial (todo opcional)
            'purpose' => ['nullable', 'string', 'max:500'],
            'goals' => ['nullable', 'array', 'max:20'],
            'goals.*' => ['required', 'string', 'max:255'],
            'important_dates' => ['nullable', 'array', 'max:20'],
            'important_dates.*.title' => ['required', 'string', 'max:255'],
            'important_dates.*.date' => ['required', 'date'],

            'rules' => ['nullable', 'array', 'max:20'],
            'rules.*.type' => ['required', 'string', Rule::in(['rule', 'commitment', 'condition'])],
            'rules.*.description' => ['required', 'string', 'max:500'],
            'rules.*.requires_acceptance' => ['required', 'boolean'],

            'task' => ['nullable', 'array'],
            'task.title' => ['required_with:task', 'string', 'max:255'],
            'task.description' => ['nullable', 'string', 'max:1000'],
            'task.due_date' => ['nullable', 'date'],

            'expenses' => ['nullable', 'array'],
            'expenses.currency' => ['required_with:expenses', 'string', Rule::in(self::CURRENCIES)],
            'expenses.budget' => ['nullable', 'numeric', 'min:0', 'max:9999999999'],
            'expenses.split' => ['required_with:expenses', 'string', Rule::in(['equal', 'contribution'])],
            'expenses.contribution_amount' => [
                'nullable',
                'required_if:expenses.split,contribution',
                'numeric',
                'gt:0',
                'max:9999999999',
            ],
        ];
    }
}
