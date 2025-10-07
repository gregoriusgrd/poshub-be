import { badRequest } from "../../../core/errors/http-error";
import { StartShiftDTO } from "../dto/shift.dto";
import { findActiveShiftByCashier, createShift } from "../repositories/shift.repository";

export const startShiftService = async (cashierId: number, data: StartShiftDTO) => {
    const existingShift = await findActiveShiftByCashier(cashierId);
    if (existingShift) throw badRequest("You already have an active shift");

    const newShift = await createShift(cashierId, data.openingBalance);

    return newShift;
}