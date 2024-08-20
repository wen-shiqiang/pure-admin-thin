export interface NoticeInfoType {
  title?: string;
  id?: number;
}
import {
  ref,
  type Ref,
  unref,
  type UnwrapRef,
  readonly,
  type DeepReadonly,
  type UnwrapNestedRefs
} from "vue";
import merge from "lodash/merge";

type UseSetStateType<S> = S | (() => S) | Ref<S> | (() => Ref<S>);

function useSetState<S extends Record<string, any>>(
  initialState: UseSetStateType<S>
): [
  DeepReadonly<
    UnwrapNestedRefs<[S] extends [Ref<any>] ? S : Ref<UnwrapRef<S>>>
  >,
  (patch: Record<string, any>, cover?: boolean) => void
] {
  const getInitialState = () => unref(initialState);

  const state = ref<S>(getInitialState() as S);

  const setMergeState = (patch: Record<string, any>, cover = false) => {
    const newState = unref(patch);
    // @ts-ignore
    if (cover) state.value = newState;
    else state.value = newState ? merge(state.value, newState) : state.value;
  };
  // @ts-ignore
  return [readonly(state), setMergeState];
}

export default useSetState;
export type Title = string | number;
export interface YearParams {
  year: string | number;
}
