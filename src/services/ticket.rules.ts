//business logic rule

//map of what correct values to transition from for status' value
const validStatusTransition: Record<string, string[]> = {
  todo: ["in_progress"],
  in_progress: ["todo", "completed"],
  completed: ["in_progress"],
};

export const isValidStatusTransition = (from: string, to: string): boolean => {
  //look through the object for matching key, and checks if to (parameter) is included in the value(which is an array - hence includes)
  return validStatusTransition[from]?.includes(to) ?? false;
};
