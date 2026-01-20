export const getClimbImageUrl = (board, climbId) => {
  const { data } = supabase.storage
    .from("climb-images")
    .getPublicUrl(`${board}/${climbId}.png`);

  return data.publicUrl;
};
