<?php

namespace App\Enums;

enum AgreementStatus: string
{
    case Cancelled = "Cancelled";
    case Incomplete = "Incomplete";
    case Pending = "Pending";
    case Completed = "Completed";
}
