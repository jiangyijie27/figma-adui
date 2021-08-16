interface IBaseObject {
  [key: string]: any;
}
interface IAdditionalClassName {
  className: string;
  style: string;
}

interface IRenderProps {
  node: SceneNode;
  generate: IGenerate;
  additionalClassNames: string[];
}

type TTheme = null | 'light';
type TIntent =
  | 'normal'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | undefined;
type TSize = 'mini' | 'small' | 'medium' | 'large' | undefined;
type TBasicHeight = 42 | 36 | 30 | 26;

type IGenerate = (node: SceneNode) => string;
