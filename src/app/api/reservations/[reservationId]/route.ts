import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';

interface IParams {
  reservationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams },
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) return NextResponse.error();

  const { reservationId } = params;

  if (!reservationId || typeof reservationId !== 'string')
    throw new Error('Invalid ID');

  // The owner of the place and the creator of the listing will be able to delete the reservation.
  const reservation = await prisma?.reservation.deleteMany({
    where: {
      id: reservationId,
      OR: [
        { userId: currentUser?.id },
        { listing: { userId: currentUser?.id } },
      ],
    },
  });

  return NextResponse.json(reservation);
}