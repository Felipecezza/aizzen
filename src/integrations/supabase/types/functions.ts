import type { Json } from './shared';

export interface Functions {
  bytea_to_text: {
    Args: { data: string };
    Returns: string;
  };
  create_user_with_profile: {
    Args: { user_email: string; user_password: string };
    Returns: Json;
  };
  http: {
    Args: Record<PropertyKey, never>;
    Returns: unknown;
  };
  http_delete: {
    Args: { uri: string } | { uri: string; content: string; content_type: string };
    Returns: unknown;
  };
  http_get: {
    Args: { uri: string } | { uri: string; data: Json };
    Returns: unknown;
  };
  http_head: {
    Args: { uri: string };
    Returns: unknown;
  };
  http_header: {
    Args: { field: string; value: string };
    Returns: unknown;
  };
  http_list_curlopt: {
    Args: Record<PropertyKey, never>;
    Returns: { curlopt: string; value: string }[];
  };
  http_patch: {
    Args: { uri: string; content: string; content_type: string };
    Returns: unknown;
  };
  http_post: {
    Args: { uri: string; content: string; content_type: string } | { uri: string; data: Json };
    Returns: unknown;
  };
  http_put: {
    Args: { uri: string; content: string; content_type: string };
    Returns: unknown;
  };
  http_reset_curlopt: {
    Args: Record<PropertyKey, never>;
    Returns: boolean;
  };
  http_set_curlopt: {
    Args: { curlopt: string; value: string };
    Returns: boolean;
  };
  text_to_bytea: {
    Args: { data: string };
    Returns: string;
  };
  urlencode: {
    Args: { data: Json } | { string: string };
    Returns: string;
  };
}