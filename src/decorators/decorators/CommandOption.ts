import "reflect-metadata";
import { MetadataStorage, Modifier } from "../..";
import { ParameterDecoratorEx } from "../../types/public/decorators";
import { DSimpleCommand } from "../classes/DSimpleCommand";
import { DSimpleCommandOption } from "../classes/DSimpleCommandOption";

export function CommandOption(name?: string): ParameterDecoratorEx;
export function CommandOption(
  name: string,
  params?: { description?: string; type?: "string" | "number" | "boolean" }
): ParameterDecoratorEx;
export function CommandOption(
  name?: string,
  params?: { description?: string; type?: "string" | "number" | "boolean" }
) {
  return function (target: Record<string, any>, key: string, index: number) {
    const type =
      params?.type ??
      // eslint-disable-next-line @typescript-eslint/ban-types
      ((Reflect.getMetadata("design:paramtypes", target, key) as Function[])[
        index
      ].name.toLowerCase() as "string" | "number" | "boolean" | undefined);

    const option = DSimpleCommandOption.create(
      name ?? key,
      type,
      params?.description
    ).decorate(target.constructor, key, target[key], target.constructor, index);

    MetadataStorage.instance.addModifier(
      Modifier.create<DSimpleCommand>((original) => {
        original.options = [...original.options, option];
      }, DSimpleCommand).decorate(
        target.constructor,
        key,
        target[key],
        target.constructor,
        index
      )
    );

    MetadataStorage.instance.addCommandOption(option);
  };
}
